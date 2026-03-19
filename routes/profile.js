const express = require("express");
const router = express.Router();
const VolunteerProfile = require("../models/VolunteerProfile");


// ================= SAVE PROFILE =================
router.post("/save-profile", async (req, res) => {
  try {

    const userEmail = req.session.email;

    const {
      fullName,
      age,
      dob,
      gender,
      qualification,
      previousVolunteer,
      volunteerExperience
    } = req.body;

    const newProfile = new VolunteerProfile({
      userId: req.session.userId,
      fullName,
      email: userEmail,
      age,
      dob,
      gender,
      qualification,
      previousVolunteer,
      volunteerExperience
    });

    await newProfile.save();

    res.redirect("/profile/volunteer/profile/view");

  } catch (error) {

    console.error("Save Error:", error);
    res.send("Error saving profile");

  }
});


// ================= UPDATE PROFILE =================
router.post("/update-profile", async (req, res) => {
  try {

    const userEmail = req.session.email;

    const {
      fullName,
      age,
      dob,
      gender,
      qualification,
      previousVolunteer,
      volunteerExperience
    } = req.body;

    const updatedProfile = await VolunteerProfile.findOneAndUpdate(
      { email: userEmail },
      {
        fullName,
        age,
        dob,
        gender,
        qualification,
        previousVolunteer,
        volunteerExperience
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.send("Profile not found");
    }

    res.redirect("/profile/volunteer/profile/view");

  } catch (error) {

    console.error("Update Error:", error);
    res.send("Error updating profile");

  }
});


// ================= PROFILE ENTRY =================
router.get("/volunteer/profile", async (req, res) => {
  try {

    const userEmail = req.session.email;

    const profile = await VolunteerProfile.findOne({ email: userEmail });

    if (profile) {

      // If profile exists → go to view page
      res.redirect("/profile/volunteer/profile/view");

    } else {

      // If new user → show form
      res.render("volunteerProfile", { profile: null });

    }

  } catch (error) {

    console.error(error);
    res.send("Error loading profile");

  }
});


// ================= VIEW PROFILE =================
router.get("/volunteer/profile/view", async (req, res) => {
  try {

    const userEmail = req.session.email;

    const profile = await VolunteerProfile.findOne({ email: userEmail });

    if (!profile) {

      // If profile doesn't exist → go to form
      return res.redirect("/profile/volunteer/profile");

    }

    res.render("volunteerProfileView", { profile });

  } catch (error) {

    console.error(error);
    res.send("Error loading profile");

  }
});


// ================= EDIT PROFILE =================
router.get("/volunteer/profile/edit", async (req, res) => {
  try {

    const userEmail = req.session.email;

    const profile = await VolunteerProfile.findOne({ email: userEmail });

    if (!profile) {
      return res.redirect("/profile/volunteer/profile");
    }

    res.render("volunteerProfile", { profile });

  } catch (error) {

    console.error(error);
    res.send("Error loading edit form");

  }
});


module.exports = router;