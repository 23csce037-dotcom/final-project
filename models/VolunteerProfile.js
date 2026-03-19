const mongoose = require("mongoose");


const volunteerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fullName: String,
  email: String,
  age: Number,
  dob: Date,
  gender: String,
  qualification: String,
  previousVolunteer: String,
  volunteerExperience: String
}, { timestamps: true });


module.exports = mongoose.model("VolunteerProfile", volunteerProfileSchema);
