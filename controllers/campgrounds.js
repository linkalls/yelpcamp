const Campground = require("../models/campground")
const { cloudinary } = require("../cloudinary")
const mbxGeocodeing = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocodeing({ accessToken: mapboxToken })

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render("campgrounds/index", { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new")
}

module.exports.showCampground = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        //* reviewインスタンスに対して
        path: "author",
      },
    })
    .populate("author")
  // console.log(campground)
  if (!campground) {
    req.flash("error", "このキャンプ場は見つかりませんでした")
    return res.redirect("/campgrounds")
  }
  res.render("campgrounds/show", { campground })
}

module.exports.createCampground = async (req, res) => {
  const campground = new Campground(req.body.campground)
  const geoData = await geocoder
    .forwardGeocode({
      query: "愛知県名古屋市",
      limit: 1,
    })
    .send()
  console.log(geoData.body.features[0].geometry) //* { type: 'Point', coordinates: [ 136.902403, 35.187295 ] }
  // features: [
  //   {
  //     id: 'place.2451572',
  //     type: 'Feature',
  //     place_type: [Array],
  //     relevance: 0.99,
  //     properties: [Object],
  //     text: '名古屋市',
  //     place_name: '名古屋市, Aichi, Japan',
  //     matching_place_name: '名古屋市, 愛知県, Japan',
  //     bbox: [Array],
  //     center: [Array],
  //     geometry: [Object],
  //     context: [Array]
  //   }
  // ],
  // campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  // campground.author = req.user._id
  // await campground.save()
  // // console.log(campground)
  // req.flash("success", "新しいキャンプ場を登録しました")
  // res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash("error", "このキャンプ場は見つかりませんでした")
    return res.redirect("/campgrounds")
  }
  res.render("campgrounds/edit", { campground })
}

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) //* スプレッド
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  campground.images.push(...imgs) //* pushで配列そのままは無理
  // console.log(...imgs)
  await campground.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) //* imagesのなかでfilenameがreq.body.deleteImagesの中と一致するものを取り除く
  }
  req.flash("success", "キャンプ場を更新しました")
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash("success", "キャンプ場を削除しました")
  res.redirect("/campgrounds")
}
