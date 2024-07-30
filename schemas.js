const Joi = require("joi")

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(), //* という名前のあるキーを期待
  deleteImages: Joi.array(),
})

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(), //* review[rating]ってしてるから
    body: Joi.string().required(),
  }).required(),
})
