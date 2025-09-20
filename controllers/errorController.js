// const utilities = require("../utilities/")

/* ************************************
* Intentionally trigger a 500 error
******************************** */
async function triggerError(req, res, next) {
  next({ status: 500, message: "Intentional Server Error: Something broke!" })
}

module.exports = { triggerError }