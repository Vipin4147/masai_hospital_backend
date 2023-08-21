const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://vipin:vipin@cluster0.k9v3sif.mongodb.net/masai_hospital?retryWrites=true&w=majority"
);

module.exports = {
  connection,
};
