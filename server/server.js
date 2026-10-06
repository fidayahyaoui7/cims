const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",          // 🔹 your pg username
  host: "localhost",
  database: "mon_app",       // 🔹 your database
  password: "your_password", // 🔹 your pg password
  port: 5432,
});

// ====================== REGISTER ======================
// Register route
app.post("/register", async (req, res) => {
  const { name, email, password, phone, userType, specialty, licenseNumber } = req.body;

  try {
    // Check required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if user exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Extra validation for medecin
    if (userType === "medecin") {
      if (!specialty || !licenseNumber) {
        return res.status(400).json({ success: false, message: "Doctors must provide specialty and license number" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, user_type, specialty, license_number) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) 
       RETURNING id, name, email, user_type, specialty, license_number`,
      [name, email, hashedPassword, phone, userType, specialty || null, licenseNumber || null]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.user_type }, "mysecretkey", { expiresIn: "7d" });

    // ✅ Always send JSON back
    return res.status(201).json({ success: true, user, token });

  } catch (err) {
    console.error("Register error:", err);
    // ✅ Even errors return JSON
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// ====================== LOGIN ======================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    delete user.password;

    const token = jwt.sign({ id: user.id, email: user.email, role: user.user_type }, "mysecretkey", { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
