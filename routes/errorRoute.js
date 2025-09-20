// Neede Resources
const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

/* ***********************
  *Intentional 500 Error
  * ********************* */
router.get("/trigger", errorController.triggerError);

module.exports = router