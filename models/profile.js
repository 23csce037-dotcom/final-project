const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    // 🔑 Link profile to logged-in user
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    age: {
        type: Number
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },

    dob: {
        type: Date
    },

    disability: {
        type: String
    },

    percentage: {
        type: Number,
        min: 0,
        max: 100
    },

    location: {
        type: String
    },

    qualification: {
        type: String
    },

    ExprienceLevel: {
        type: String
    },

    JobExpectations: {
        type: String
    },

    Joblocation: {
        type: String
    },

    placementReady: {
    type: Boolean,
    default: false
},

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Profile", profileSchema);

