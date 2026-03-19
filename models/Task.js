const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  volunteerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"VolunteerProfile"
  },

  taskTitle:String,
  taskDescription:String,
  assignedDate:{
    type:Date,
    default:Date.now
  },

  status:{
    type:String,
    default:"Pending"
  }

});

module.exports = mongoose.model("Task",taskSchema);