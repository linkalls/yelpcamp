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
    const price = Math.floor(Math.random() * 2000) + 1000
    const randomCityIndex = Math.floor(Math.random() * cities.length) //* cities.lengthは300くらいあるから0~300が出る
    const camp = new Campground({
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`, //* location: '茨城県石岡市',
      title: `${sample(descriptors)}・${sample(places)}`, //* []やなくて()だよ
      image: "https://picsum.photos/800",
      description:
        "ぼく飛びおりて、あいつをとって、またくるくると包んで紐でくくりました。すこしたべてごらんなさい鳥捕りは、こっちに向き直りました。またこれを巨きな乳の流れたあとだと言われたりしているうちに、ぴたっと押えちまうんです。そしてきゅうくつな上着の肩を気にしながら、声もなくかたちもなく音もない水にかこまれて、ほんとうにこんや遠くへ行ったようにぶっきらぼうに言いました。川上の方を見ると、一人のせいの高い子供が、窓から外を見ていました。",
      // price: price //* 省略表記で書く
      price,
    })
    await camp.save() //* forの中
  }
  // const c = new Campground({title: "アフリカン"})
  // await c.save()
}

seedDb() //* promise帰ってくる
  .then(() => {
    mongoose.connection.close() //* これで止められる
  })
