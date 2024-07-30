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

const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

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

app.use(session(sessionConfig)) //* passport.sessionより前に書く

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) //* User.authenticate()　pluginが勝手にやってくれる
passport.serializeUser(User.serializeUser()) //* sessionの中にユーザーを設定する方法
passport.deserializeUser(User.deserializeUser())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash("success") //* これを使うと一回のリクエスト内で使える変数を一時的に保存　テンプレートから使えるnext()
  res.locals.error = req.flash("error")
  next()
})

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/fakeuser",async(req,res)=>{
 const user = new User({email: "hogege@a.com",username: "hogehoge"})
 const newUser = await User.register(user,"moge")
 res.send(newUser)
//  {
//   "_id": "66a84fa03029d27b00066c65",
//   "email": "hogege@a.com",
//   "username": "hogehoge",
//   "salt": "ffde61bbd3b539fd292bb047893a68c34b645793a0aaa099e9a2b5870899bd68",
//   "hash": "279adff6653b6162813fceb45d17d277de572738b33d3cf3fed323d6c4a828b620f2bd4d99fd7278e4e32e315adcea18c3b14d4dd4856f89b3f03a4d1ee2d97361674389f20503b1d177af07dc4d76ca3b74e236eeb220d34f0769a4f055ae211598e42fc8e18d5e9f9cb13d657346631eb8915b26a485c1a386a37b4a930df6b72a35aece8883b81af386e5270bdab7b2f39ec47dbd94380e56a2dd922e97205dcf8a36cc28fcbc7ceb588bbbda505108fb8690b8410c15c147f174ca3a159b58a8946e66dafcf66463f70e564317dfe683d613923c1155fb65511c15110431a4b5d0f0795d3dbe7ed72a8792966ed8f4da11336adb94487323dbc4383dc2fc6f4ca2b6a898e10d13e284a19d661aef002ca0b1473a81b6a9ad082dc9f74a49112a00188e39f8d7eb370817b2ef3d89b74f91dd0ced9e1b7431c8f0992e84a65fbd92b6a0dcda71e20801566eb73d2e7f4001bbe12450baf93167073804b6e007b3aff15fdf3cdb718dba484c50cdc1a678666ebc0c749117994e675ba7f1a1b714e1121d14c16a1840c7da5cfe47b7571b562977a0a33fd9988d6a54406a1545dd1fe9c0314ef785454d14ca61bac3d4ca1f09913054dc02f90027a188df7096b9a36ffaf89f32358912d1a79ec6cc8525ff918f6d11d9d3e8937991ee41a5d675ebcb0bf77de039ae4c4ffa921325290172843e0675dea52fb9263f0f45f5",
//   "__v": 0
//   }
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
