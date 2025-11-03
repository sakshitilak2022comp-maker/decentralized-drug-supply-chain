// ===== server.js =====
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ Register User (Sign Up)
app.post("/register", (req, res) => {
  const { firstName, lastName, mobile, email, password, role } = req.body;
  if (!firstName || !lastName || !mobile || !email || !password || !role)
    return res.status(400).json({ success: false, message: "All fields required" });

  const checkQuery = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkQuery, [email, mobile], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err });
    if (results.length > 0)
      return res.status(409).json({ success: false, message: "User already exists" });

    const insertQuery = `
      INSERT INTO users (first_name, last_name, mobile, email, password, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(insertQuery, [firstName, lastName, mobile, email, password, role], (err) => {
      if (err) return res.status(500).json({ success: false, message: err });
      res.status(200).json({ success: true, message: "Registration successful" });
    });
  });
});

// ✅ Login User (Sign In)
app.post("/login", (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  const query = "SELECT * FROM users WHERE mobile = ? AND password = ?";
  db.query(query, [mobile, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err });
    if (results.length === 0)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const user = results[0];
    const logQuery = "INSERT INTO login_logs (user_id, login_time) VALUES (?, NOW())";
    db.query(logQuery, [user.id]);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.first_name,
        role: user.role,
      },
    });
  });
});

// ✅ Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/signin-signup.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Redirect all unknown routes
app.get("*", (req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});