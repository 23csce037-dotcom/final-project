const express = require("express");
const router = express.Router();
const Scholarship = require("../models/Scholarship");


// scholarship page
router.get("/scholarships", (req, res) => {
    res.render("scholarships");
});


// OPEN FORM PAGE  ✅ IMPORTANT ROUTE
router.get("/scholarship/apply", async (req, res) => {

    const userId = req.session.userId;

    const existing = await Scholarship.findOne({ userId });

    res.render("scholarship-form", {
        data: existing
    });
});


// SUBMIT FORM
router.post("/scholarship/apply", async (req, res) => {

    try {

        const userId = req.session.userId;

        const formData = {
            userId,
            degree: req.body.degree,
            cgpa: req.body.cgpa,
            passout: req.body.passout,
            college: req.body.college,
            phone: req.body.phone
        };

        const existing = await Scholarship.findOne({ userId });

        if (existing) {
            await Scholarship.updateOne({ userId }, formData);
        } else {
            await Scholarship.create(formData);
        }

        res.render("scholarship-form", {
            data: formData,
            success: "✅ Scholarship application submitted successfully!"
        });

    } catch (err) {

        console.error(err);

        res.render("scholarship-form", {
            data: req.body,
            error: "❌ Error submitting scholarship application. Please try again."
        });

    }

});

module.exports = router;