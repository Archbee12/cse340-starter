const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")

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
  // const htmlData = await utilities.buildVehicleDetail(vehicle)
  let nav = await utilities.getNav()
  const reviews = await reviewModel.getReviewsByInventoryId(invId)

  const vehicleHTML = await utilities.buildVehicleDetail(vehicle)
  const reviewSection = utilities.buildReviewSection(vehicle, reviews, res.locals.accountData)

  const htmlData = vehicleHTML + reviewSection

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
  const classificationList = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    errors: null
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
    errors: null,
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
      errors: null,
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
    errors: null
  })
}

/* *****************************
 * Handle inventory submission Adding new vehicle
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

/* *****************************
 * Handle inventory submission Updating Inventory Data
 * **************************** */
invCont.updateInventory = async function (req, res) {
  const {
    inv_id,
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

  try {
    const updateResult = await invModel.updateInventory(
      inv_id,
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
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated`)
      res.redirect("/inv")
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id,
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
    }
  } catch (error) {
    console.error("updateInventory error:", error)
    next(error)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* *****************************
 * Build the update inventory
 * **************************** */
invCont.buildUpdateInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  console.log('itemData:', itemData)
  let classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* *****************************
 * Build Delete Confirmation View
 * **************************** */
invCont.buildDeleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id) // Get the item ID from the URL
    let nav = await utilities.getNav()

    // Fetch the vehicle data from the database
    const itemData = await invModel.getInventoryById(inv_id)

    // Build vehicle name for title
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    // Render the delete-confirm view
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price
    })
  } catch (error) {
    console.error("buildDeleteView error:", error)
    next(error)
  }
}

/* *****************************
 * Delete Inventory Item
 * **************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
      req.flash("notice", "The inventory item was successfully deleted.")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.redirect(`/inv/delete-inventory/${inv_id}`)
    }
  } catch (error) {
    console.error("deleteInventory error:", error)
    next(error)
  }
}

module.exports = invCont