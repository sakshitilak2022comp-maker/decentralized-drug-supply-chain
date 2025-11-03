// // ===== server.js =====
// import express from "express";
// import mysql from "mysql2";
// import dotenv from "dotenv";
// import cors from "cors";
// import bodyParser from "body-parser";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // ✅ Database connection (supports both DATABASE_URL and manual env vars)
// let dbConfig;

// if (process.env.DATABASE_URL) {
//   // Parse full connection URL
//   const dbUrl = new URL(process.env.DATABASE_URL);
//   dbConfig = {
//     host: dbUrl.hostname,
//     user: dbUrl.username,
//     password: dbUrl.password,
//     database: dbUrl.pathname.slice(1),
//     port: dbUrl.port || 3306,
//   };
//   console.log("📡 Using DATABASE_URL for connection:", dbConfig.host);
// } else {
//   // Fallback for local testing
//   dbConfig = {
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "",
//     database: process.env.DB_NAME || "",
//     port: process.env.DB_PORT || 3306,
//   };
//   console.log("🧩 Using local DB connection settings");
// }

// const db = mysql.createConnection(dbConfig);

// // Try to connect
// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//   } else {
//     console.log("✅ Connected to MySQL Database");
//   }
// });

// // ✅ Register User (Sign Up)
// // app.post("/register", (req, res) => {
// //   const { firstName, lastName, mobile, email, password } = req.body;
// //   if (!firstName || !lastName || !mobile || !email || !password)
// //     return res
// //       .status(400)
// //       .json({ success: false, message: "All fields required" });

// //   const checkQuery = "SELECT * FROM users WHERE email = ? OR mobile = ?";
// //   db.query(checkQuery, [email, mobile], (err, results) => {
// //     if (err) return res.status(500).json({ success: false, message: err });
// //     if (results.length > 0)
// //       return res
// //         .status(409)
// //         .json({ success: false, message: "User already exists" });

// //     const insertQuery = `
// //       INSERT INTO users (first_name, last_name, mobile, email, password, created_at)
// //       VALUES (?, ?, ?, ?, ?, NOW())
// //     `;
// //     db.query(insertQuery, [firstName, lastName, mobile, email, password], (err) => {
// //       if (err) return res.status(500).json({ success: false, message: err });
// //       res.status(200).json({ success: true, message: "Registration successful" });
// //     });
// //   });
// // });

// app.post("/register", (req, res) => {
//   const { firstName, lastName, mobile, email, password } = req.body;

//   console.log("📨 Incoming Registration Request:", req.body); // 👈 see data sent

//   if (!firstName || !lastName || !mobile || !email || !password)
//     return res.status(400).json({ success: false, message: "All fields required" });

//   const checkQuery = "SELECT * FROM users WHERE email = ? OR mobile = ?";
//   db.query(checkQuery, [email, mobile], (err, results) => {
//     if (err) {
//       console.error("❌ Error checking users:", err);
//       return res.status(500).json({ success: false, message: `Check query error: ${err.sqlMessage}` });
//     }

//     console.log("🔍 Check Query Results:", results.length);

//     if (results.length > 0)
//       return res.status(409).json({ success: false, message: "User already exists" });

//     const insertQuery = `
//       INSERT INTO users (first_name, last_name, mobile, email, password, created_at)
//       VALUES (?, ?, ?, ?, ?, NOW())
//     `;
//     db.query(insertQuery, [firstName, lastName, mobile, email, password], (err) => {
//       if (err) {
//         console.error("❌ Error inserting new user:", err);
//         return res.status(500).json({ success: false, message: `Insert error: ${err.sqlMessage}` });
//       }
//       console.log("✅ User inserted successfully!");
//       res.status(200).json({ success: true, message: "Registration successful" });
//     });
//   });
// });


// // ✅ Login User (Sign In)
// app.post("/login", (req, res) => {
//   const { mobile, password } = req.body;
//   if (!mobile || !password)
//     return res
//       .status(400)
//       .json({ success: false, message: "All fields required" });

//   const query = "SELECT * FROM users WHERE mobile = ? AND password = ?";
//   db.query(query, [mobile, password], (err, results) => {
//     if (err) return res.status(500).json({ success: false, message: err });
//     if (results.length === 0)
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });

//     const user = results[0];
//     const logQuery = "INSERT INTO login_logs (user_id, login_time) VALUES (?, NOW())";
//     db.query(logQuery, [user.id]);

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.first_name,
//       },
//     });
//   });
// });

// // ✅ Routes
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/signin-signup.html"));
// });

// app.get("/dashboard", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/index.html"));
// });

// // ✅ Serve static files
// app.use(express.static(path.join(__dirname, "../frontend")));

// // ✅ Redirect all unknown routes
// app.get("*", (req, res) => {
//   res.redirect("/");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at: http://localhost:${PORT}`);
// });




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

// ✅ Allow both local & Netlify frontend URLs
app.use(
  cors({
    origin: [
      "https://decentralized-drug-supply.netlify.app", // 🔁 replace with your actual Netlify URL
      "http://localhost:5500", // local testing
      "http://127.0.0.1:5500",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// ✅ Database connection (supports Render/Railway URL or local)
let dbConfig;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    port: dbUrl.port || 3306,
  };
  console.log("📡 Using DATABASE_URL for connection:", dbConfig.host);
} else {
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "railway",
    port: process.env.DB_PORT || 3306,
  };
  console.log("🧩 Using local DB connection settings");
}

const db = mysql.createConnection(dbConfig);

// ✅ Try connecting
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ REGISTER ROUTE
app.post("/register", (req, res) => {
  const { firstName, lastName, mobile, email, password } = req.body;
  console.log("📨 Incoming Registration Request:", req.body);

  // Validation
  if (!firstName || !lastName || !mobile || !email || !password) {
    console.warn("⚠️ Missing fields in registration");
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  const checkQuery = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkQuery, [email, mobile], (err, results) => {
    if (err) {
      console.error("❌ Error checking users:", err);
      return res
        .status(500)
        .json({ success: false, message: `Database check error: ${err.sqlMessage}` });
    }

    console.log("🔍 Existing Users Found:", results.length);

    if (results.length > 0)
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });

    const insertQuery = `
      INSERT INTO users (first_name, last_name, mobile, email, password, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(insertQuery, [firstName, lastName, mobile, email, password], (err) => {
      if (err) {
        console.error("❌ Error inserting new user:", err);
        return res
          .status(500)
          .json({ success: false, message: `Insert error: ${err.sqlMessage}` });
      }

      console.log("✅ New user inserted successfully");
      res
        .status(200)
        .json({ success: true, message: "Registration successful" });
    });
  });
});

// ✅ LOGIN ROUTE
app.post("/login", (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password)
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });

  const query = "SELECT * FROM users WHERE mobile = ? AND password = ?";
  db.query(query, [mobile, password], (err, results) => {
    if (err) {
      console.error("❌ Login query error:", err);
      return res.status(500).json({ success: false, message: err.sqlMessage });
    }

    if (results.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const user = results[0];
    console.log("✅ Login success for:", user.first_name);

    const logQuery =
      "INSERT INTO login_logs (user_id, login_time) VALUES (?, NOW())";
    db.query(logQuery, [user.id]);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.first_name,
      },
    });
  });
});

// ✅ Serve pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/signin-signup.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Catch-all redirect
app.get("*", (req, res) => res.redirect("/"));

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
