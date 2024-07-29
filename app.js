const express = require("express")
const app = express()
const path = require("path")
const catchAsync = require("./utils/catchAsync.js")
const mongoose = require("mongoose")
const Campground = require("./models/campground") //* 大文字ね
const methodOverride = require("method-override")
const engine = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const { campgroundSchema, reviewSchema } = require("./schemas")
const Review = require("./models/review")
const campgroundsRouter = require("./routes/campground")

mongoose
  .connect("mongodb://localhost:27017/yelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("接続ok")
  })
  .catch((error) => console.log("エラー", error))

app.engine("ejs", engine)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.urlencoded()) //* formからのpost ミドルウェア
app.use(methodOverride("_method"))

const validateCampground = (req, res, next) => {
  //* app.useじゃないよ
  //* これはミドルウェアね
  // const campgroundSchema = Joi.object({
  //   campground: Joi.object({
  //     title: Joi.string().required(),
  //     price: Joi.number().required().min(0),
  //   }).required(), //* という名前のあるキーを期待
  // })
  const { error } = campgroundSchema.validate(req.body)
  console.log(error.message)
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

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

app.get("/", (req, res) => {
  res.render("home")
})

app.use("/campgrounds",campgroundsRouter)

app.post(
  "/campgrounds/:id/reviews",
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

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //* 特定のcampgroundの中でreviewsIdと一致しているreviewsを削除
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
  })
)

// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({ title: "私の庭", description: "気軽に安くキャンプ" })
//   await camp.save()
//   res.send(camp)
// })
app.all("*", (req, res, next) => {
  next(new ExpressError("ページが見つからなかったよ", 404)) //* エラーハンドラーに任せる
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "何か問題が発生しました" } = err //* 上でのエラーがerrに入ってる
  if (!err.message) {
    err.message = "問題が起こったよ"
  }
  res.status(statusCode).render("error", { err }) //errオブジェクトそのまま
})

app.listen(3000, () => {
  console.log("port3000で起動中")
})
