const mongoose = require("mongoose")
const { Schema } = mongoose
const Review = require("./review")

const imageSchema = new Schema({
  url: String,
  filename: String,
})

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200")
})

const option = { toJSON: { virtuals: true } }

const campgroundSchema = new Schema(
  {
    title: String,
    images: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      //* 配列だからpushいけるよ
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  option
)

campgroundSchema.virtual("properties.popupMarkup").get(function () {
  return `<strong><a href="/campgrounds${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0,20)}...</p>`
})

campgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews }, //* idが含まれてたら削除
    })
  }

  // console.log(doc)
  // {
  //   reviews: [],
  //   _id: 66a4ef6d8f46131e9cd551d5,
  //   location: '東京都昭島市',
  //   title: 'タンブリング・スプリング',
  //   image: 'https://picsum.photos/800',
  //   description: 'ぼく飛びおりて、あいつをとって、またくるくると包んで紐でくくりました。すこしたべてごらんなさい鳥捕りは、こっちに向き直りました。また これを巨きな乳の流れたあとだと言われたりしているうちに、ぴたっと押えちまうんです。そしてきゅうくつな上着の肩を気にしながら、声もなくかたちもなく音も ない水にかこまれて、ほんとうにこんや遠くへ行ったようにぶっきらぼうに言いました。川上の方を見ると、一人のせいの高い子供が、窓から外を見ていました。',
  //   price: 2293,
  //   __v: 0
  // }
})

module.exports = mongoose.model("Campground", campgroundSchema) // campgroundモデル作成
