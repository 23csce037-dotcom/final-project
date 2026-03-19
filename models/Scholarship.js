const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    degree: String,
    cgpa: Number,
    passout: Number,
    college: String,
    phone: String
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);