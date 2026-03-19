const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});


// 🔥 DO NOT force collection name
module.exports = mongoose.model("Event", eventSchema);