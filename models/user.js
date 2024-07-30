const mongoose = require("mongoose")
const { Schema } = mongoose
const passportLocalMongoose = require("passport-local-mongoose") //* こいつがかってにpassword usernameをスキーマに入れてくれる

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, //* 一意になる
  },
})

userSchema.plugin(passportLocalMongoose) //* passportLocalMongooseの機能がスキーマに組みこまれる

module.exports = mongoose.model("User", userSchema)
