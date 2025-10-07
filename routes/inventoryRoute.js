// Neede Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

//Router to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Router to build vehicle details by inventory
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildDetail));

// Router to build the management inventory
router.get(
  "/", 
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement));

// Add classification form
router.get("/add-classification", utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Add Classification
router.post("/add-classification",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory form
router.get("/add-inventory",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process inventory form
router.post("/add-inventory",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Get the inventory list by classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Load update form
router.get(
  "/edit/:inv_id",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildUpdateInventoryView)  // make sure it’s updateInventoryView, not buildupdateInventory
)

// Load delete form
router.get(
  "/delete/:inv_id", 
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildDeleteView)
)

// Handle update form POST
router.post(
  "/update-inventory",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.post(
  "/delete-inventory",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;