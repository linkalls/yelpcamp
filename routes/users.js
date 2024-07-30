const express = require("express")
const router = express.Router()
const passport = require("passport")
const users = require("../controllers/users")

router.get("/register", users.renderRegister)

router.post("/register", users.register)

router.get("/login", users.renderLogin)

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }),
  users.login
)

router.get("/logout", users.renderLogout)

module.exports = router
