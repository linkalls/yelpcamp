module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user)
  if (!req.isAuthenticated()) {
    //* ログインしてるかどうか
    req.flash("error", "ログインしてください")
    return res.redirect("/login")
  }
  next()
}
