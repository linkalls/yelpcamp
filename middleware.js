const ExpressError = require("./utils/ExpressError")
const { campgroundSchema } = require("./schemas")
const Campground = require("./models/campground")
const { reviewSchema } = require("./schemas")


module.exports.validateReview = (req, res, next) => {
  //* ミドルウェア
  const { error } = reviewSchema.validate(req.body) //* validatedじゃないよ
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}


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

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "そのアクションの権限がありません")
    return res.redirect(`/campgrounds/${campground._id}`)
  }
  next()
}
