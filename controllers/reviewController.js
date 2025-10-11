const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const reviewController = {}

/* Display reviews for a specific vehicle */
reviewController.buildVehicleReviews = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const vehicle = await invModel.getInventoryById(inv_id)
  const reviews = await reviewModel.getReviewsByInventoryId(inv_id)
  let nav = await utilities.getNav()
  res.render("review/list", {
    title: "Vehicle Reviews",
    nav,
    reviews,
    message: null,
  })
}

/* Show add review form */
reviewController.buildAddReview = async function (req, res, next) {
  const inv_id = req.params.inv_id
  let nav = await utilities.getNav()
  res.render("review/add", {
    title: "Add a Review",
    nav,
    inv_id,
    message: null,
  })
}

/* Handle add review form submission */
reviewController.addReview = async function (req, res, next) {
  const { inv_id, review_text, review_rating } = req.body
  const account_id = res.locals.accountData.account_id
  const result = await reviewModel.addReview(inv_id, account_id, review_text, review_rating)
  if (result) {
    req.flash("notice", "Review added successfully!")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Error adding review.")
    res.redirect(`/review/add/${inv_id}`)
  }
}

module.exports = reviewController
