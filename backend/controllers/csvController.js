const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const validator = require('validator');
const pool = require('../models/db');

// Helper function to check for valid email format and required fields
const validateCustomer = (data) => {
  const errors = [];
  
  // Check if fields are present
  if (!data.name || !data.email || !data.phone || !data.company) {
    errors.push('Missing required fields');
  }

  // Validate email format
  if (!validator.isEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Validate phone number (simple check for digits)
  if (!/^\d+$/.test(data.phone)) {
    errors.push('Phone number should only contain digits');
  }

  return errors;
};

// Upload and process the CSV file
exports.uploadCSV = async (req, res) => {
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const errors = [];
  const batchSize = 1000; // Process in batches of 1000

  // Read and parse the CSV file
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (row) => {
      const validationErrors = validateCustomer(row);
      
      if (validationErrors.length > 0) {
        errors.push({ row: row, errors: validationErrors });
      } else {
        results.push({
          name: row.name,
          email: row.email,
          phone: row.phone,
          company: row.company
        });
      }
    })
    .on('end', async () => {
      // Insert valid records in batches
      const insertPromises = [];
      while (results.length > 0) {
        const batch = results.splice(0, batchSize);

        const values = batch.map(r => `('${r.name}', '${r.email}', '${r.phone}', '${r.company}')`).join(', ');

        const insertQuery = `
          INSERT INTO customers (name, email, phone, company)
          VALUES ${values}
          RETURNING id
        `;
        
        insertPromises.push(pool.query(insertQuery));
      }

      try {
        await Promise.all(insertPromises); 
        res.json({
          message: 'CSV processed successfully!',
          totalProcessed: results.length,
          errors: errors.length,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
};
