const express = require("express")
const router = express.Router({ mergeParams: true }) //* これでidが取れる
const catchAsync = require("../utils/catchAsync")
const Campground = require("../models/campground")
const Review = require("../models/review")
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware")


router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    // res.send(req.body)
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review) //* 大文字
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "レビューを追加しました")
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //* 特定のcampgroundの中でreviewsIdと一致しているreviewsを削除
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "レビューを削除しました")
    res.redirect(`/campgrounds/${id}`)
  })
)

module.exports = router
