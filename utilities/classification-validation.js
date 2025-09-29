const { body, validationResult } = require("express-validator")
const validate = {}
const utilities = require(".")
const invModel = require("../models/inventory-model")



validate.classificationRules = () => {
  return [
    body("classification_name")
      // .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Classification must contain only letters (no spaces, numbers, or special characters).")
      .custom(async (classification_name) => {
        const exists = await invModel.checkExistingClassification(classification_name)
        if (exists > 0) {
          throw new Error("That classification already exists.")
        }
      })
  ]
}

/* Middleware to check validation results */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.status(400).render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate
