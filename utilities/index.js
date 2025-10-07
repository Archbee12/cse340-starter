const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************
  * Constructs the nav HTML unordered list
  **************************** */
Util.getNav = async function (req, res, next) {
  const invModel = require("../models/inventory-model")
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page"> Home</a> </li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name + 
      ' vehicles">' +
      row.classification_name + 
      "</a>"
      list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************************
* Build the classification view HTML
* ********************************** */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************************
* Build the classification view HTML
* ********************************** */
Util.buildVehicleDetail = async function(vehicle) {
  const color = vehicle.inv_color ? vehicle.inv_color.toLowerCase() : "black";

  let detail = `
    <section id="inv-detail">
      <p class="vehicle-name">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model} </p>
      <div class="vehicle-inv">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        <div class="info">
          <h2>${vehicle.inv_make} ${vehicle.inv_model} details</h2>
          <h3>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</h3>
          <p class="year"><strong>Year:</strong> ${vehicle.inv_year}</p>
          <p class="mileage"><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
          <p class="color">
            <strong>Color:</strong> 
            <span class="col" style="color:${color}"> ${vehicle.inv_color}</span>
          </p>
          <p class="desc"><strong>Description:</strong> ${vehicle.inv_description}</p>
        </div>
      </div>
    </section>
  `
  return detail
}

/* ************************************
* Build the classification <select> element
* ********************************** */
Util.buildClassificationList = async function(selectedId = null) {
  const invModel = require("../models/inventory-model")
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}" 
      ${selectedId == row.classification_id ? "selected" : ""}>
      ${row.classification_name}
    </option>`
  })

  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
 
/****************************
 * Middleware to check token validity
 * Unit 5, Login Process activity
 ***************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        // ✅ Restore user session
        req.session.loggedin = true
        req.session.accountData = accountData

        res.locals.accountData = accountData
        res.locals.loggedin = true
        next()
      }
    )
  } else {
    next()
  }
}

/* ***********************************
 *  Check Login
 * ********************************* */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* **************************
 *  Authorization Middleware
 *  Only allow Employee or Admin users
 * **************************** */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  if (res.locals.accountData && res.locals.accountData.account_type) {
    const type = res.locals.accountData.account_type
    if (type === "Employee" || type === "Admin") {
      return next() // Authorized
    }
  }

  req.flash("notice", "You must be logged in as an Employee or Admin to access this area.")
  return res.status(403).redirect("/account/login")
}

module.exports = Util