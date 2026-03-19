const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ================= VIEW EVENTS PAGE =================
router.get("/events", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.render("admin-events", { events });
});

// ================= ADD NEW EVENT =================
router.post("/events/add", async (req, res) => {
  const { title, description, date } = req.body;

  await Event.create({
    title,
    description,
    date
  });

  res.redirect("/admin/events");
});

// ================= DELETE EVENT =================
router.get("/events/delete/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect("/admin/events");
});

module.exports = router;
