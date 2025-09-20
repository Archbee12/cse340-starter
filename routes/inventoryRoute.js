// Neede Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

//Router to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Router to build vehicle details by inventory
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildDetail));



module.exports = router;