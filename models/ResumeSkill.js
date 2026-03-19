const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    fullName: String,
    education: String,
    experience: String,
    preferredJobRole: String,
    disabilityType: String,
    skills: [String],
    resumeFile: String
    
});

module.exports = mongoose.model("ResumeSkills", resumeSchema);
