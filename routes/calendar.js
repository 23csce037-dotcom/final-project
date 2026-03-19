const express = require("express");
const router = express.Router();
const Event = require("../models/Event");


// ================= ADMIN PAGE =================
router.get("/admin", (req, res) => {
  res.render("admin-calendar");
});


// ================= USER PAGE =================
router.get("/user", (req, res) => {
  res.render("user-calendar");
});


// ================= GET ALL EVENTS =================
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});


// ================= ADD EVENT =================
router.post("/add", async (req, res) => {
  try {
    const newEvent = new Event({
      date: req.body.date,
      title: req.body.title,
      description: req.body.description,
    });


    await newEvent.save();
    res.json({ message: "Event Added Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding event" });
  }
});


// ================= DELETE EVENT =================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event" });
  }
});


module.exports = router;
