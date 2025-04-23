const pool = require("../models/db");

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// Add a new customer
exports.addCustomer = async (req, res) => {
  const { name, email, phone, company } = req.body;
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO customers (name, email, phone, company, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null]
    );    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add customer" });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company } = req.body;

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE customers
       SET name = $1, email = $2, phone = $3, company = $4
       WHERE id = $5
       RETURNING *`,
      [name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM customers WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};

// Get customers by tag IDs
exports.getCustomersByTags = async (req, res) => {
  const { tags } = req.query;

  if (!tags) {
    return res.status(400).json({ error: "No tag IDs provided" });
  }

  const tagIds = tags.split(",").map(id => parseInt(id.trim())).filter(Boolean);
  if (tagIds.length === 0) {
    return res.status(400).json({ error: "Invalid tag IDs" });
  }

  try {
    const result = await pool.query(
      `
      SELECT DISTINCT c.*
      FROM customers c
      JOIN customer_tags ct ON ct.customer_id = c.id
      WHERE ct.tag_id = ANY($1::int[])
      ORDER BY c.id DESC
      `,
      [tagIds]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers by tags" });
  }
};

// Function to search and filter customers
// Search and filter customers by name or tag
exports.searchAndFilterCustomers = async (req, res) => {
  const { search, tags } = req.query;

  // Prepare search term and tag term (both can be empty or null)
  const searchTerm = search?.trim() || ''; // Default to empty string if search is null/empty
  const tagTerm = tags?.trim() || '';      // Default to empty string if tags is null/empty

  // Prepare query values
  const values = [searchTerm, tagTerm];

  // Construct query dynamically based on input
  let query = `
    SELECT DISTINCT c.*
    FROM customers c
    LEFT JOIN customer_tags ct ON ct.customer_id = c.id
    LEFT JOIN tags t ON t.id = ct.tag_id
    WHERE 
      (LOWER(c.name) LIKE '%' || LOWER($1) || '%' OR 
      LOWER(t.name) LIKE '%' || LOWER($2) || '%')
    ORDER BY c.id DESC;
  `;

  try {
    const result = await pool.query(query, values);

    // If no results are found, send an empty array
    if (result.rows.length === 0) {
      return res.json([]);
    }

    // Send the results back as JSON
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search/filter customers' });
  }
};


