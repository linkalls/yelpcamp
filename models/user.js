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

userSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    UserExistsError: "そのユーザー名は既に使われています",
    UserExistsError: "パスワードを入力してください",
    AttemptTooSoonError:"アカウントがロックされています。時間を空けて再度お試しください",
    TooManyAttemptsError: "ログイン失敗が続いたためアカウントをロックしました",
    NoSaltValueStoredError: "認証ができませんでした",
    IncorrectPasswordError: "パスワードまたはユーザー名が間違っています",
    IncorrectUsernameError: "パスワードまたはユーザー名が間違っています"
  },
}) //* passportLocalMongooseの機能がスキーマに組みこまれる

module.exports = mongoose.model("User", userSchema)
