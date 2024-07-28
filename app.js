const express = require("express")
const app = express()
const path = require("path")
const catchAsync = require("./utils/catchAsync.js")
const mongoose = require("mongoose")
const Campground = require("./models/campground") //* 大文字ね
const methodOverride = require("method-override")
const Joi = require("joi")
const engine = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")

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

app.get("/", (req, res) => {
  res.render("home")
})

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
  })
)

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new")
})

app.post(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
      }).required(), //* という名前のあるキーを期待
    })
    const { error } = campgroundSchema.validate(req.body)
    console.log(error.message)
    if (error) {
      const msg = error.details.map((detail) => detail.message).join(",")
      throw new ExpressError(msg, 400)
    }
    // if (!req.body.Campground) {
    //   throw new ExpressError("不正なキャンプ場のデータです", 400) //* これはキーがあるかどうかだけ見てる
    // }
    const campground = new Campground(req.body.campground)
    await campground.save()
    console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`)
    // res.send(req.body)  {
    //   "campground": {
    //   "title": "aqa",
    //   "location": "qaa"
    //   }
    //   }
  })
)

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/show", { campground })
  })
)

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit", { campground })
  })
)

app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) //* スプレッド
    res.redirect(`/campgrounds/${id}`)
  })
)

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
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
