const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    // Link job to specific PWD candidate
    candidateId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // ✅ CORRECT
        required: true
    }

}, { timestamps: true });   // auto adds createdAt & updatedAt

module.exports = mongoose.model("Job", jobSchema);