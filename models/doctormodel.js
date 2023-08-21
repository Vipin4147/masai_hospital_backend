const mongoose = require("mongoose");

let DoctorSchema = mongoose.Schema({
  name: String,
  image: String,
  specialization: String,
  experience: Number,
  location: String,
  date: Date,
  slots: Number,
  fee: Number,
});

const DoctorModel = mongoose.model("doctors", DoctorSchema);

module.exports = {
  DoctorModel,
};
