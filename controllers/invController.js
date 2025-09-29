const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()

    let className = "Unknown"
    if (data && data.length > 0) {
      className = data[0].classification_name
    }

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("buildByClassificationId error:", error)
    next(error) // pass error to error-handling middleware
  }
}


/* *****************************
  * Build single vehicle detail view
  * **************************** */
invCont.buildDetail = async function (req, res, next) {
  const invId = req.params.inventoryId
  const vehicle = await invModel.getInventoryById(invId)
  const htmlData = await utilities.buildVehicleDetail(vehicle)
  let nav = await utilities.getNav()

  const vehicleTitle = 
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  })
}

/* *****************************
  * Build the management view
  * **************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: null
  })
}

/* *****************************
  * Build the add-classification form
  * **************************** */
 invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    // message: null,
    errors,
  })
 }

 // Handle the form submission
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  let nav = await utilities.getNav()

  if (result) {
    req.flash(
      "notice", 
      `Successfully added ${classification_name}.`
    )
    return res.redirect("/inv")
  } else {
    req.flash("error", "Sorry, the classification could not be added.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
    })
  }
}

/* *****************************
 * Build the add-inventory form
 * **************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors,
  })
}

/* *****************************
 * Handle inventory submission
 * **************************** */
invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(classification_id)

  const result = await invModel.addInventory({
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  })

  if (result) {
    req.flash("notice", `Successfully added ${inv_year} ${inv_make} ${inv_model}.`)
    return res.redirect("/inv")
  } else {
    req.flash("error", "Sorry, the vehicle could not be added.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
}


module.exports = invCont