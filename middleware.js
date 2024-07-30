module.exports.isLoggedIn = (req,res,next)=>{
  if (!req.isAuthenticated()){ //* ログインしてるかどうか
    req.flash("error","ログインしてください")
    return res.redirect("/login")
  }
  next()
}

