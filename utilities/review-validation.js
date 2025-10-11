const { body, validationResult } = require("express-validator")
const utilities = require(".")

const reviewValidate = {}

reviewValidate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Review must be at least 3 characters long."),
  ]
}

reviewValidate.checkReviewData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const inv_id = req.body.inv_id
    res.render("review/add", {
      title: "Add Review",
      nav,
      errors,
      message: "Please correct the following errors:",
      inv_id,
    })
    return
  }
  next()
}

module.exports = reviewValidate
