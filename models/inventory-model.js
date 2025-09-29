const pool = require("../database/")

/* *************************
  * Get all classification data
  * ************************ */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c
          ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
      [invId]
            
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

/* ***************************
 *  Inserting new classification name
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    console.error("addClassification error: " + error)
    return null
  }
}

/* **********************
 *   Check for existing classification name
 * ********************* */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount 
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Inserting new vechicle to the inventory
 * ************************** */
async function addInventory(vehicle) {
  try {
    const sql = `
      INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`
    const data = await pool.query(sql, [
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_year,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.inv_price,
      vehicle.inv_miles,
      vehicle.inv_color,
      vehicle.classification_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addInventory error: ", error)
    throw error
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, checkExistingClassification, addInventory };