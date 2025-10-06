const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")

const invValidate = {}

/***************************
  * Inventory Data Validation Rules
************************* */
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),
    
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number."),
    
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    
    body("classification_id")
      .isInt()
      .withMessage("You must select a classification.")
  ]
}

/***************************
 * Check data and return errors on vehicle inventory
 ************************* */
invValidate.checkInventoryData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)

    res.status(400).render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
    })
    return
  }
  next()
}

// Update Inventory Data
invValidate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_image, inv_thumbnail, inv_miles, inv_color, classification_id} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    const { inv_id, inv_make, inv_model } = req.body
    const itemName = `${inv_make} ${inv_model}`

    res.status(400).render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classificationList,
    })
    return
  }
  next()
}

module.exports = invValidate
