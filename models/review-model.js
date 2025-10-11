const pool = require("../database/")

/* Get reviews by inventory ID */
async function getReviewsByInventoryId(inv_id) {
  try {
    const result = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, 
              a.account_firstname, a.account_lastname
       FROM review AS r
       JOIN account AS a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return result.rows
  } catch (error) {
    console.error("getReviewsByInventoryId error:", error)
  }
}

/* Add a review */
async function addReview(inv_id, account_id, review_text) {
  try {
    const result = await pool.query(
      `INSERT INTO review (inv_id, account_id, review_text)
       VALUES ($1, $2, $3) RETURNING *`,
      [inv_id, account_id, review_text]
    )
    return result.rows[0]
  } catch (error) {
    console.error("addReview error:", error)
  }
}

module.exports = { getReviewsByInventoryId, addReview }
