const mongoose = require("mongoose")
const Campground = require("../models/campground") //* 一個上がる
const cities = require("./cities") //* 配列ね
const { places, descriptors } = require("./seedHelpers") //* これも配列

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

const sample = (array) => array[Math.floor(Math.random() * array.length)] //* 配列を渡す

const seedDb = async () => {
  await Campground.deleteMany({}) //* 全部削除
  for (let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length) //* cities.lengthは300くらいあるから0~300が出る
    const camp = new Campground({
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`, //* location: '茨城県石岡市',
      title: `${sample(descriptors)}・${sample(places)}`, //* []やなくて()だよ
    })
    await camp.save() //* forの中
  }
  // const c = new Campground({title: "アフリカン"})
  // await c.save()
}

seedDb()
