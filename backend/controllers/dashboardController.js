// dashboardController.js
const pool = require("../models/db");

// Get total number of customers
exports.getCustomerCount = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM customers");
    res.json({ totalCustomers: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customer count" });
  }
};

// Get new customers (daily, weekly, monthly)
exports.getNewCustomers = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') AS daily,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS weekly,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS monthly
        FROM customers
      `);
  
      const row = result.rows[0];
      res.json({
        daily: parseInt(row.daily, 10),
        weekly: parseInt(row.weekly, 10),
        monthly: parseInt(row.monthly, 10),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch new customers" });
    }
  };
  
// Get customer count by tag
exports.getTagwiseCustomerCount = async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT t.id, t.name, COUNT(ct.customer_id) AS count
         FROM tags t
         LEFT JOIN customer_tags ct ON ct.tag_id = t.id
         GROUP BY t.id, t.name
         ORDER BY t.name`
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch tag-wise customer count" });
    }
  };  
  
