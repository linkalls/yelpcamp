const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const engine = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")

const campgroundRouter = require("./routes/campground")
const reviewRouter = require("./routes/reviews")

const session = require("express-session")
const flash = require("connect-flash")

mongoose
  .connect("mongodb://localhost:27017/yelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
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
app.use(express.static(path.join(__dirname, "public")))

const sessionConfig = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}

app.use(session(sessionConfig))

app.use(flash())


app.use((req,res,next)=>{
  res.locals.success = req.flash("success") //* これを使うと一回のリクエスト内で使える変数を一時的に保存　テンプレートから使えるnext()
  next()
})

app.get("/", (req, res) => {
  res.render("home")
})

app.use("/campgrounds", campgroundRouter)

app.use("/campgrounds/:id/reviews", reviewRouter) //: ここで定義したパラメーターは明示的に

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
