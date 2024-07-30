const express = require("express")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")

router.get("/register", (req, res) => {
  res.render("users/register")
})

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email }) //* passwordは渡さない
    // console.log(user)
    const registerUser = await User.register(user, password)
    // console.log(registerUser)
    req.flash("success", "YelpCampへようこそ")
    res.redirect("/campgrounds")
  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/register")
  }
})

router.get("/login", (req, res) => {
  res.render("users/login")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  //* passportが勝手に認証してくれる req.bodyのusernameとpassport見て
  req.flash("success", "お帰りなさい")
  res.redirect("/campgrounds")
})

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