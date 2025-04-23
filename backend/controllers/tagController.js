const pool = require("../models/db");

// Get all tags
exports.getTags = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign tags to a customer
exports.assignTags = async (req, res) => {
  const { customerId, tagIds } = req.body;

  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return res.status(400).json({ error: "tagIds must be a non-empty array" });
  }

  try {
    // First delete existing tags
    await pool.query("DELETE FROM customer_tags WHERE customer_id = $1", [customerId]);

    // Insert new ones
    const insertPromises = tagIds.map(tagId =>
      pool.query("INSERT INTO customer_tags (customer_id, tag_id) VALUES ($1, $2)", [customerId, tagId])
    );

    await Promise.all(insertPromises);

    res.json({ message: "Tags assigned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tags for a specific customer
exports.getTagsForCustomer = async (req, res) => {
  const { customerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT t.id, t.name FROM tags t
       JOIN customer_tags ct ON ct.tag_id = t.id
       WHERE ct.customer_id = $1`,
      [customerId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
