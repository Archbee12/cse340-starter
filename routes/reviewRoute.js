const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");
const reviewValidate = require("../utilities/review-validation");

// Add a new review
router.post(
  "/add",
  utilities.checkJWTToken,  // user must be logged in
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Get all reviews for a specific vehicle (optional route)
router.get(
  "/vehicle/:inv_id",
  utilities.handleErrors(reviewController.getVehicleReviews)
);

// Delete a review (optional)
// router.post(
//   "/delete/:review_id",
//   utilities.checkJWTToken,
//   utilities.handleErrors(reviewController.deleteReview)
// );

module.exports = router;
