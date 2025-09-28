// Neede Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
classValidate = require("../utilities/classification-validation")
invValidate = require("../utilities/inventory-validation")

//Router to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Router to build vehicle details by inventory
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildDetail));

// Router to build the management inventory
router.get("/", utilities.handleErrors(invController.buildManagement));

// Add classification form
router.get("/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Add Classification
router.post("/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory form
router.get("/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process inventory form
router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)


module.exports = router;