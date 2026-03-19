const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session"); // ✅ REQUIRED FOR LOGIN

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MongoDB Connection =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// 🔍 Show connected DB name (very helpful for debugging)
mongoose.connection.once("open", () => {
  console.log("ℹ️ Connected to DB:", mongoose.connection.name);
});

// ================= Middleware =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= Set View Engine (IMPORTANT) =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ SESSION MUST COME BEFORE ROUTES
app.use(
  session({
    name: "react.sid",
    secret: "react_secret_key",
    resave: false,
    saveUninitialized: false,
  cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  }),
);


// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));
// images folder 
app.use("/images", express.static(path.join(__dirname, "images")));

// ✅ Calendar Route
const calendarRoutes = require("./routes/calendar");
app.use("/calendar", calendarRoutes);

// ================= Routes =================
app.use("/", require("./routes/pages")); // GET routes
app.use("/", require("./routes/auth"));  // POST routes
//app.use("/admin", require("./routes/ad_event"));
app.use("/", require("./routes/jobs"));
app.use("/", require("./routes/scholarship"));
app.use("/profile", require("./routes/profile"));
app.use("/", require("./routes/pageRoutes"));

// ================= 404 =================
app.use((req, res) => {
  res.status(404).send("<h2>404 Not Found</h2>");
});

// ================= Start Server =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});