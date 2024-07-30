const express = require("express")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")
const e = require("connect-flash")

router.get("/register", (req, res) => {
  res.render("users/register")
})

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email }) //* passwordは渡さない
    // console.log(user)
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err)
      }
      req.flash("success", "YelpCampへようこそ")
      res.redirect("/campgrounds")
    })
  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/register")
  }
})

router.get("/login", (req, res) => {
  res.render("users/login")
})

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }),
  (req, res) => {
    req.flash("success", "お帰りなさい")
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirectUrl)
  }
)

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.flash("success", "ログアウトが完了しました")
    res.redirect("/campgrounds")
  })
})

module.exports = router
