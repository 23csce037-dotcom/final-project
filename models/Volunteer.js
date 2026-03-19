const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  age: Number,
  motivation: String,
  skills: String
});


module.exports = mongoose.model("Volunteer", volunteerSchema);
