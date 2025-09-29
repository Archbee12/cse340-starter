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

module.exports = invValidate
