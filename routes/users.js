const express = require("express")
const router = express.Router()
const passport = require("passport")
const users = require("../controllers/users")

router.route("/register").get(users.renderRegister).post(users.register)

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }),
    users.login
  )

router.get("/logout", users.renderLogout)

module.exports = router
