const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({

    // 🔑 Link employer profile to logged-in user
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // 👤 Employer Personal Details
    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        min: 18
    },

    // 🏢 Company Details
    companyname: {
        type: String,
        required: true,
        trim: true
    },

    companyemail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },

    phone: {
        type: Number
    },

    companytype: {
        type: String
    },

    domain: {
        type: String
    },

    companysize: {
        type: Number
    },

    companylocation: {
        type: String
    },

    website: {
        type: String
    },

    description: {
        type: String
    }

}, { timestamps: true });  

module.exports = mongoose.model("employers", employerSchema);