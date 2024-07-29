const express = require("express")
const router = express.Router({mergeParams: true}) //* これでidが取れる
const catchAsync = require("../utils/catchAsync")
const Campground = require("../models/campground")
const { reviewSchema } = require("../schemas")
const Review = require("../models/review")




const validateReview = (req, res, next) => {
  //* ミドルウェア
  const { error } = reviewSchema.validate(req.body) //* validatedじゃないよ
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    // res.send(req.body)
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review) //* 大文字
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //* 特定のcampgroundの中でreviewsIdと一致しているreviewsを削除
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
  })
)

module.exports = router