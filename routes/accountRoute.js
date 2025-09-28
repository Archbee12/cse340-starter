// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const loginValidate = require("../utilities/account-validation")

// Build my Account Login View 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Register View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Posting the register request
router.post(
  '/register', 
  regValidate.registrationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
)

module.exports = router