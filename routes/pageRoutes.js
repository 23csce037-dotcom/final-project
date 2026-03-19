// routes/pageRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const Volunteer = require("../models/Volunteer");

// ================== STATIC PAGES ==================
router.get("/volunteer/events", (req, res) => {
  res.render("events");
});

router.get("/volunteer/community", (req, res) => {
  res.render("community");
});

router.get("/volunteer/interview", (req, res) => {
  res.render("volunteer-interview");
});
// ================== FORM SUBMISSION ==================
router.post("/volunteer-interview", async (req, res) => {
  try {
    const newVolunteer = new Volunteer({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      qualification: req.body.qualification,
      previousExperience: req.body.previousExperience,
      experienceDetails: req.body.experienceDetails,
      interestArea: req.body.interestArea,
      availability: req.body.availability,
      motivation: req.body.motivation,
      skills: req.body.skills
    });

    await newVolunteer.save();

    res.send(`<script>
      alert("Your Application saved successfully! ✅");
      window.location.href="/community-development";
    </script>`);

  } catch (err) {
    console.error(err);
    res.send(`<script>
      alert("Something went wrong. Please try again.");
      window.history.back();
    </script>`);
  }
});

module.exports = router;
