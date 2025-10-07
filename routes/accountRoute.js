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

// Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
/* ************************
*  Process Login
*  Stickiness activity*/
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
  utilities.handleErrors(accountController.accountLogin)
)

// Account Update View
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Posting the update view
router.post(
  "/update",
  utilities.checkLogin,
  accountController.updateAccountInfo
)

// Update password route
router.post(
  "/update-password",
  utilities.handleErrors(accountController.updatePassword)
)

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logoutAccount));

module.exports = router