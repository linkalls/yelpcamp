const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const Campground = require("./models/campground") //* 大文字ね

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

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({ title: "私の庭", description: "気軽に安くキャンプ" })
  await camp.save()
  res.send(camp)
})

app.listen(3000, () => {
  console.log("port3000で起動中")
})
