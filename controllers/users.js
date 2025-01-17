const User = require("../models/user")

module.exports.renderRegister = (req, res) => {
  res.render("users/register")
}

module.exports.register = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
  res.render("users/login")
}

module.exports.login = (req, res) => {
  req.flash("success", "お帰りなさい")
  const redirectUrl = req.session.returnTo || "/campgrounds"
  delete req.session.returnTo
  res.redirect(redirectUrl)
}

module.exports.renderLogout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.flash("success", "ログアウトが完了しました")
    res.redirect("/campgrounds")
  })
}
