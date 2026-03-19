const express = require("express");
const router = express.Router();
const Job = require("../models/job");


// ================= ADMIN SEND JOB TO SPECIFIC PWD =================
router.post("/admin/jobs/add/:candidateId", async (req, res) => {
    try {
        const { jobTitle, company, location, jobType, salary, description } = req.body;
        const candidateId = req.params.candidateId;

        await Job.create({
            jobTitle,
            company,
            location,
            jobType,
            salary,
            description,
            candidateId   // 🔗 link job to specific PWD
        });

        // success redirect
        res.redirect("/admin/pwd?success=1");

    } catch (err) {
        console.error("Send job error:", err);
        res.status(500).send("Error sending job");
    }
});


// ================= ADMIN VIEW JOB HISTORY FOR A SPECIFIC CANDIDATE =================
router.get("/admin/jobs/:candidateId", async (req, res) => {
    try {
        const candidateId = req.params.candidateId;

        const jobs = await Job.find({ candidateId })
            .sort({ createdAt: -1 });

        res.render("admin_job_history", { jobs });

    } catch (err) {
        console.error("Job history error:", err);
        res.status(500).send("Error loading job history");
    }
});


// ================= ADMIN VIEW ALL JOB HISTORY =================
router.get("/admin/jobs/history", async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("candidateId", "fullName email")
            .sort({ createdAt: -1 });

        res.render("admin_job_history", { jobs });

    } catch (err) {
        console.error("All job history error:", err);
        res.status(500).send("Error loading all job history");
    }
});


// ================= PWD USER VIEW ONLY THEIR JOBS =================
router.get("/jobs", async (req, res) => {
    try {
        if (!req.session.userId)
            return res.redirect("/login");

        const jobs = await Job.find({ candidateId: req.session.userId })
            .sort({ createdAt: -1 });

        res.render("jobs", { jobs });


    } catch (err) {
        console.error("PWD jobs error:", err);
        res.status(500).send("Error loading jobs");
    }
});


module.exports = router;