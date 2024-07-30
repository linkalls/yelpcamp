module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user)
  if (!req.isAuthenticated()) {
    //* ログインしてるかどうか
    // console.log(req.path,req.originalUrl) //* /new /campgrounds/new
    req.session.returnTo = req.originalUrl
    req.flash("error", "ログインしてください")
    return res.redirect("/login")
  }
  next()
}
