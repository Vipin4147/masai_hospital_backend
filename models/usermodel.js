const mongoose = require("mongoose");

let UserSchema = mongoose.Schema({
  email: String,
  password: String,
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = {
  UserModel,
};
