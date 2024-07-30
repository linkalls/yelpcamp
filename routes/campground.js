const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")
const campgrounds = require("../controllers/campgrounds")

router
  .route("/")
  .get(catchAsync(campgrounds.index)) // パスを指定しない
  // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
.post((req,res)=>{
  console.log(req.body) //* url-encodedにしてたから　{}
  res.send("受け付けました")
})

router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))



router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router
