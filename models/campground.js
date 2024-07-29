const mongoose = require("mongoose")
const { Schema } = mongoose // この行を修正しました

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [ //* 配列だからpushいけるよ
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
})


module.exports = mongoose.model("Campground", campgroundSchema) // campgroundモデル作成
