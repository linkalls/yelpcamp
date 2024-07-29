const mongoose = require("mongoose")
const {Schema} = mongoose.Schema // この行を修正しました

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
})

module.exports = mongoose.model("Campground", campgroundSchema) // campgroundモデル作成
