const Review = require("../models/review")
const Campground = require("../models/campground")


module.exports.createReview = async (req, res) => {
  // res.send(req.body)
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review) //* 大文字
  review.author = req.user._id
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  req.flash("success", "レビューを追加しました")
  res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //* 特定のcampgroundの中でreviewsIdと一致しているreviewsを削除
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "レビューを削除しました")
  res.redirect(`/campgrounds/${id}`)
}