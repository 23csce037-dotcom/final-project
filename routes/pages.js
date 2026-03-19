const Event = require("../models/Event");
const express = require("express");
const router = express.Router();
const path = require("path");
const Resume = require("../models/ResumeSkill");
const Feedback = require("../models/feedback"); 
const Scholarship = require("../models/Scholarship");
const Profile = require("../models/profile");
const VolunteerProfile = require("../models/VolunteerProfile");
const Task = require("../models/Task");
const Employer = require("../models/employers");
const Volunteer = require("../models/Volunteer");

// ================= Calendar Pages =================

router.get("/calendar", (req, res) => {
  res.render("calender"); // keep name if your file is calender.ejs
});

router.get("/admin_calendar", (req, res) => {
  res.render("admin-calendar");
});


router.get("/user", (req, res) => {
  res.render("user-calendar");
});
// ================= Chatbot =================


router.get("/chatbot", (req, res) => {
  res.render("chatbot");
});
router.get("/communities", (req, res) => {
  res.render("communities");
});
router.get("/higher_education", (req, res) => {
  res.render("higher_education");
});

router.get("/services", (req, res) => {
  res.render("services");
});


router.get("/dis", (req, res) => {
  res.render("dis");
});


router.get("/emp", (req, res) => {
  res.render("emp");
});


router.get("/edu", (req, res) => {
  res.render("edu");
});


router.get("/profit", (req, res) => {
  res.render("profit");
});


router.get("/government", (req, res) => {
  res.render("government");
});


router.get("/parents", (req, res) => {
  res.render("parents");
});


router.get("/projects", (req, res) => {
  res.render("projects");
});


router.get("/programs", (req, res) => {
  res.render("programs");
});

router.get("/livelihood", (req, res) => {
  res.render("livelihood");
});


// ================= Calendar API =================

// GET ALL EVENTS
router.get("/events", (req, res) => {
  const events = JSON.parse(fs.readFileSync(filePath));
  res.json(events);
});


// ADD EVENT
router.post("/add", (req, res) => {
  const events = JSON.parse(fs.readFileSync(filePath));


  events.push(req.body);


  fs.writeFileSync(filePath, JSON.stringify(events, null, 2));


  res.json({ message: "Event Added Successfully" });
});
// ===== Index =======//
router.get("/", (req, res) => {
  res.render("index");
});

// ======== Register ======== // 
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});
// ==== STAFF PAGE =====
router.get("/staffdash", async (req, res) => {
  try {

    const year = req.query.year || "all";

    let pwdMatch = {};
    let volMatch = {};
    let empMatch = {};

    if (year !== "all") {

      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);

      pwdMatch = { createdAt: { $gte: start, $lte: end } };
      volMatch = { createdAt: { $gte: start, $lte: end } };
      empMatch = { createdAt: { $gte: start, $lte: end } };

    }

    const pwdMonthly = await Profile.aggregate([
      { $match: pwdMatch },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const volunteerMonthly = await VolunteerProfile.aggregate([
      { $match: volMatch },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const employerMonthly = await Employer.aggregate([
      { $match: empMatch },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.render("staffdash", {
      pwdMonthly,
      volunteerMonthly,
      employerMonthly,
      selectedYear: year
    });

  } catch (err) {

    console.log(err);

    res.render("staffdash", {
      pwdMonthly: [],
      volunteerMonthly: [],
      employerMonthly: [],
      selectedYear: "all"
    });

  }
});
// ========== VOLUNTEER DASSHBOARD PAGE ===============
router.get("/volunteer", (req, res) => {
  res.render("volDash");
});

// 👤 My Profile (Smart Route)
// If profile exists → show table view
// If not → show fresh form

router.get("/volunteer/profile", async (req, res) => {
  try {

    const profile = await VolunteerProfile.findOne({
      userId: req.session.userId
    });

    if (profile) {
      res.render("volunteerProfileView", { profile });
    } else {
      res.render("volunteerProfile");
    }

  } catch (err) {
    console.log(err);
    res.send("Server Error");
  }
});

// ✏ Edit Profile
router.get("/volunteer/profile/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/update-profile.html"));
});

// 📋 Assigned Tasks
// ========== Volunteers task page =============
router.get("/volunteer/tasks", async (req,res)=>{

try{
const profile = await VolunteerProfile.findOne({
  userId: req.session.userId
});

if(!profile){
return res.send("Volunteer profile not found. Please create your profile first.");
}

const tasks = await Task.find({
  volunteerId: profile._id
});

res.render("assigned-tasks",{tasks});

}catch(err){
console.log(err);
res.send("Error loading tasks");
}
});

// 📅 Events
router.get("/volunteer/events", (req, res) => {
  res.render("events");
});

// 🤝 Community
router.get("/volunteer/community", (req, res) => {
  res.render("community");
});

// 📚 Education Support
router.get("/volunteer/education-support", (req, res) => {
  res.render("education-support");
});

// ❤️ Health Awareness
router.get("/volunteer/health-awareness", (req, res) => {
  res.render("health-awareness");
});

// 📝 Volunteer Interview
router.get("/volunteer/interview", (req, res) => {
  res.render("volunteer-interview");
});

// ===== ADMIN VOLUNTEER INTERVIEW APPLICATIONS =====
router.get("/admin/volunteers/interviews", async (req,res)=>{
  try{

    const volunteers = await Volunteer.find();

    res.render("admin_volunteer_interviews",{ volunteers });

  }catch(err){

    console.log(err);
    res.send("Error loading volunteer interviews");

  }
});

// =============== PWD Dashboard ==================
router.get("/pwd", async (req, res) => {
    if (!req.session.userId)
        return res.redirect("/login");

    const resume = await Resume.findOne({
        userId: req.session.userId
    });

    res.render("pwd", { resume });
});

// Profile Form Page
router.get("/profile", (req, res) => {
    res.render("profile");
});

//resume page PWD
router.get("/resume", (req, res) => {
    res.render("resume", { resume: null });
});

router.get("/about", (req, res) => {
     res.render("About");
});

router.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/contact.html"));
});

router.get("/dis", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/dis.html"));
});
// ============================================= //
//=============== Admin DashBoard ===============
router.get("/admin", (req, res) => {
    res.render("admin");
});
//Addmin intermediate page with cards
router.get("/admin_pwd_menu", (req, res) => {
res.render("admin_pwd_menu");
});
// ================= ADMIN PWD PAGE =================
router.get("/admin/pwd", async (req, res) => {
    try {
        const candidates = await Resume.find().populate("userId");
        res.render("admin_pwd", { candidates, query: req.query });
    } catch (err) {
        console.error("Admin PWD error:", err);
        res.status(500).send("❌ Error loading PWD page");
    }
});

// ================= SEND JOB TO PWD =================
router.post("/admin/send-job/:id", async (req, res) => {
    try {
        const resumeId = req.params.id;
        const jobMessage = req.body.jobMessage;

        await Resume.findByIdAndUpdate(resumeId, {
            $push: { jobMessages: jobMessage }
        });

        res.redirect("/admin/pwd?success=1");
    } catch (err) {
        console.error("Send job error:", err);
        res.status(500).send("❌ Failed to send job");
    }
});
// ================= SAVE FEEDBACK (FROM CONTACT PAGE) =================
router.post("/feedback", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      message
    });

    await newFeedback.save();

    return res.redirect("/contact?success=1");
  } catch (err) {
    console.log(err);
    res.send("Error saving feedback");
  }
});
// =============== ADMIN SCHOLARSHIP PAGE ===============
router.get("/admin/scholarships", async (req, res) => {
    try {
        const scholarships = await Scholarship.find().populate("userId");
        res.render("admin_scholarships", { scholarships });
    } catch (err) {
        console.log(err);
        res.send("Error loading scholarship requests");
    }
});
// ================= ADMIN PWD PROFILE VIEW PAGE ===========
router.get("/admin/pwd-profiles", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("userId");

        res.render("admin_pwd_profiles", { profiles });

    } catch (err) {
        console.log(err);
        res.send("Error loading PWD profiles");
    }
});

// ================ ADMIN VOLUNTEERS =================
// Volunteer menu page
router.get("/admin/volunteers", (req,res)=>{
    res.render("adminVolunteers");
});

//  ===== ADMIN-VOLUNTEER PROFILE TABLE FORMAT PAGE =====
// Show all volunteer profiles
router.get("/admin/volunteers/profiles", async (req,res)=>{
    try{

        const volunteers = await VolunteerProfile.find();

        res.render("adminVolunteerProfiles",{volunteers});

    }catch(err){

        console.error(err);
        res.send("Error loading volunteers");

    }
});

//======== open assign task page ===================
router.get("/admin/assign-task", async (req,res)=>{

const volunteers = await VolunteerProfile.find();

res.render("admin_assign_task",{volunteers});

});


//================ save assigned task =================
router.post("/admin/assign-task", async (req,res)=>{

const {volunteerId,taskTitle,taskDescription} = req.body;

await Task.create({
volunteerId,
taskTitle,
taskDescription
});

res.redirect("/admin/assign-task");

});

// ================= ADMIN FEEDBACK PAGE =================
router.get("/admin/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.render("admin_feedback", { feedbacks });
    } catch (err) {
        console.log(err);
        res.send("Error loading feedback");
    }
});

// ===== ADMIN EMPLOYER MENU PAGE ======
router.get("/admin_employer_menu", (req,res)=>{
    res.render("admin_employer_menu");
});

// ==== ADMIN-EMPLOYER PROFILE TABLE FORMAT PAGE =====
// Employer Profiles Page
router.get("/admin/employer-profiles", async (req, res) => {
  try {

    const employers = await Employer.find();

    res.render("admin_employer_profiles", { employers });

  } catch (err) {

    console.log(err);
    res.send("Error loading employer profiles");

  }
});

// ======== Employer Dashboard ========

router.get("/employer", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const profile = await Employer.findOne({
      userId: req.session.userId
    });

    res.render("employerdash", {
      showPushbar: !profile
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading dashboard");
  }
});

router.get("/chart", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/empdash.html"));
});

router.get("/directory", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/empCanDir.html"));
});

module.exports = router;
