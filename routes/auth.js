const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");
const User = require("../models/User");
const Profile = require("../models/profile");
const Resume = require("../models/ResumeSkill");
const Employer = require("../models/employers"); 

// MULTER CONFIG (Resume Upload)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, password, cpassword, role } = req.body;

    // ✅ Email domain check
    const allowedDomains = ["@gmail.com", "@edu.in"];
    const isAllowed = allowedDomains.some(domain =>
      username.endsWith(domain)
    );
    if (!isAllowed)
      return res.status(400).send("❌ Invalid email domain");

    // ✅ Password match
    if (password !== cpassword)
      return res.status(400).send("❌ Passwords do not match");

    // 🚫 Block staff registration
    if (role === "Staff")
      return res.status(403).send("❌ Staff registration not allowed");

    // ✅ Check existing user
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).send("❌ Username already exists");

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    await User.create({
      username,
      password: hashedPassword,
      role
    });

    res.send("✅ Registration successful! <a href='/login'>Login</a>");

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("❌ Registration failed");
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).send("❌ Invalid username");

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).send("❌ Invalid password");

    // ✅ Store session
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.username = user.username;
    req.session.email = user.username;

    // 👑 Admin
    if (user.role === "Admin") {
      if (user.username === "admin@gmail.com") {
        return res.redirect("/admin");
      } else {
        return res.status(403).send("❌ Unauthorized admin account");
      }
      }

    // 🔒 STAFF (STRICT)
    if (user.role === "Staff") {
      if (user.username === "staff@gmail.com") {
        return res.redirect("/staffdash");
      } else {
        return res.status(403).send("❌ Unauthorized staff account");
      }
    }

    // 👩‍🦽 PWD
    if (user.role === "PWD") {
      return res.redirect("/pwd");
    }

    // 👔 Employer
    if (user.role === "Employer") {
      return res.redirect("/employer");
    }

    // 🧑‍🤝‍🧑 Volunteer (if exists)
    if (user.role === "Volunteer") {
      return res.redirect("/volunteer");
    }

    // ❌ Unknown role
    res.status(403).send("❌ Invalid role");

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("❌ Login failed");
  }
});
// =====================================================
// LOAD PROFILE FORM (Edit Page)
// URL: GET /profile
// =====================================================
router.get("/profile", async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== "PWD")
      return res.status(403).send("❌ Unauthorized");

    const profile = await Profile.findOne({
      userId: req.session.userId
    });

    res.render("profile", { profile });

  } catch (err) {
    console.error("Profile form error:", err);
    res.status(500).send("❌ Error loading profile form");
  }
});
// =====================================================
// SAVE / UPDATE PROFILE
// URL: POST /profile
// =====================================================
router.post("/profile", async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== "PWD")
      return res.status(403).send("❌ Unauthorized");

    let profile = await Profile.findOne({
      userId: req.session.userId
    });

    if (profile) {
      await Profile.findByIdAndUpdate(
        profile._id,
        { $set: req.body }
      );
    } else {
      await Profile.create({
        ...req.body,
        userId: req.session.userId
      });
    }

    res.redirect("/profile/view");

  } catch (err) {
    console.error("Profile save error:", err);
    res.status(500).send("❌ Error saving profile");
  }
});
// =====================================================
// VIEW PROFILE PAGE
// URL: GET /profile/view
// =====================================================
router.get("/profile/view", async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== "PWD")
      return res.status(403).send("❌ Unauthorized");

    const profile = await Profile.findOne({
      userId: req.session.userId
    });

    if (!profile) {
      return res.redirect("/profile");
    }

    res.render("profileView", { profile });

  } catch (err) {
    console.error("Profile view error:", err);
    res.status(500).send("❌ Error loading profile");
  }
});
// =====================================================
// LOAD RESUME PAGE
// =====================================================
router.get("/resume", async (req, res) => {

    if (!req.session.userId)
        return res.redirect("/login");

    const resume = await Resume.findOne({
        userId: req.session.userId
    });

    res.render("resume", { resume });
});
// =====================================================
// SAVE RESUME + SKILLS
// =====================================================
router.post("/resume", upload.single("resume"), async (req, res) => {
    try {

        if (!req.session.userId)
            return res.redirect("/login");

        const {
            fullName,
            education,
            experience,
            preferredJobRole,
            disabilityType,
            skills
        } = req.body;

        const resumeFile = req.file ? req.file.filename : "";

        let existingResume = await Resume.findOne({
            userId: req.session.userId
        });

        const skillArray = skills
        ? skills.split("\n").map(skill => skill.trim()).filter(skill => skill)
        : [];

        if (existingResume) {
            await Resume.findByIdAndUpdate(existingResume._id, {
                fullName,
                education,
                experience,
                preferredJobRole,
                disabilityType,
                skills: skillArray,
                resumeFile: resumeFile || existingResume.resumeFile
            });
        } else {
            await Resume.create({
                userId: req.session.userId,
                fullName,
                education,
                experience,
                preferredJobRole,
                disabilityType,
                skills: skillArray,
                resumeFile
            });
        }

        res.render("resume", {
          resume: existingResume || req.body,
          success: "✅ Resume saved successfully!"
         });
    } catch (err) {
        console.error(err);
        res.send("❌ Resume upload failed");
    }
});

// ================= EMPLOYER PROFILE FORM =================
router.get("/employer/profile", async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== "Employer")
      return res.redirect("/login");

    const employer = await Employer.findOne({
      userId: req.session.userId
    });

    res.render("empProfile", { employer });

  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).send("❌ Error loading employer profile");
  }
});

// ================= SAVE / UPDATE EMPLOYER PROFILE =================
router.post("/employer/profile", async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== "Employer")
      return res.redirect("/login");

    const existingProfile = await Employer.findOne({
      userId: req.session.userId
    });

    if (existingProfile) {
      await Employer.findOneAndUpdate(
        { userId: req.session.userId },
        req.body,
        { new: true }
      );
    } else {
      const newEmployer = new Employer({
        userId: req.session.userId,
        ...req.body
      });
      await newEmployer.save();
    }

    res.redirect("/employer/profile-view");

  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    res.status(500).send("❌ Error saving employer profile");
  }
});

// ================= EMPLOYER PROFILE VIEW =================
router.get("/employer/profile-view", async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== "Employer")
      return res.redirect("/login");

    const employer = await Employer.findOne({
      userId: req.session.userId
    });

    if (!employer)
      return res.redirect("/employer/profile");

    res.render("empProfileView", { employer });

  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).send("❌ Error loading employer profile");
  }
});

// =====================================================
// CANDIDATE DIRECTORY
// =====================================================
router.get("/candidates", async (req, res) => {
    try {

        const search = req.query.search || "";

        const searchFilter = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { disability: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { ExprienceLevel: { $regex: search, $options: "i" } }
            ]
        };

        const profiles = await Profile.find(search ? searchFilter : {});

        const candidates = await Promise.all(
            profiles.map(async (profile) => {
                const resume = await Resume.findOne({
                    userId: profile.userId
                });

                return {
                    ...profile.toObject(),
                    skills: resume ? resume.skills : []
                };
            })
        );

        res.render("empCanDir", { candidates, search });

    } catch (err) {
        console.error(err);
        res.send("❌ Error loading candidates");
    }
});
// =====================================================
// CANDIDATE PROFILE 
// =====================================================
router.get("/candidate-profile", async (req, res) => {
    try {
        const search = req.query.search || "";

        // Search by name, location or disability
        const profiles = await Profile.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { disability: { $regex: search, $options: "i" } }
            ]
        });

        // Fetch resume data also
        const candidates = [];

        for (let profile of profiles) {
            const resume = await Resume.findOne({ userId: profile.userId });

            candidates.push({
                profile,
                skills: resume ? resume.skills : [],
                experience: resume ? resume.experience : ""
            });
        }

        res.render("empCanProfile", { candidates, search });

    } catch (err) {
        console.error(err);
        res.send("❌ Error loading candidates");
    }
});
// =====================================================
// VIEW FULL CANDIDATE PROFILE
// =====================================================
router.get("/candidate-profile/:id", async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);

        if (!profile)
            return res.send("Profile not found");

        const resume = await Resume.findOne({
            userId: profile.userId
        });

        res.render("empCanView", { profile, resume });

    } catch (err) {
        console.error(err);
        res.send("❌ Error loading candidate profile");
    }
});
// =====================================================
// ADMIN VIEW ALL CANDIDATES (Employer Shortlist Page)
// =====================================================
router.get("/admin/employer-shortlist", async (req, res) => {
    try {

        const profiles = await Profile.find();

        const candidates = await Promise.all(
            profiles.map(async (profile) => {

                const resume = await Resume.findOne({
                    userId: profile.userId
                });

                return {
                    ...profile.toObject(),
                    skills: resume ? resume.skills : []
                };

            })
        );

        res.render("adminShortlist", { candidates });

    } catch (err) {
        console.error(err);
        res.send("❌ Error loading candidates");
    }
});
// =====================================================
// ADMIN MARK READY FOR PLACEMENT
// =====================================================

router.post("/admin/placement-ready/:id", async (req, res) => {
    try {

        await Profile.findByIdAndUpdate(
            req.params.id,
            { placementReady: true }
        );

        res.redirect("/admin/employer-shortlist");

    } catch (err) {
        console.error(err);
        res.send("❌ Error updating placement status");
    }
});
// ================= LOGOUT =================
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.send("❌ Logout failed");
    }
    res.redirect("/login");
  });
});

module.exports = router;
