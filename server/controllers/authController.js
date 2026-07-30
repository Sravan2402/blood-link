const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();
const register = async (req, res) => {
  const client = await pool.connect();

  try {
    const { full_name, email, phone, password, role } = req.body;

    if (!full_name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userRole = role.toUpperCase();

    const validRoles = ["DONOR", "HOSPITAL", "ADMIN"];

    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser = await client.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    const newUser = await client.query(
      `INSERT INTO users
      (full_name, email, phone, password_hash, role)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [full_name, email, phone, hashedPassword, userRole],
    );

    const userId = newUser.rows[0].user_id;

    if (userRole === "DONOR") {
      await client.query("INSERT INTO donors (user_id) VALUES ($1)", [userId]);
    }

    if (userRole === "HOSPITAL") {
      await client.query("INSERT INTO hospitals (user_id) VALUES ($1)", [
        userId,
      ]);
    }

    if (userRole === "ADMIN") {
      await client.query("INSERT INTO admins (user_id) VALUES ($1)", [userId]);
    }

    await client.query("COMMIT");

    const { password_hash, ...userData } = newUser.rows[0];

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const userRole = role.toUpperCase();

    // Find user by email and role
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = $2",
      [email, userRole],
    );

    // User not found
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or role",
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "4h",
      },
    );

    // Remove password before sending response
    const { password_hash, ...userData } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, full_name, email, phone, role,
              profile_image, is_verified
       FROM users
       WHERE user_id = $1`,
      [req.user.user_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, profile_image } = req.body;
    const userId = req.user.user_id;
    const role = req.user.role;
    await pool.query(
      `UPDATE users
   SET full_name=$1,
       phone=$2,
       profile_image=$3,
       updated_at=NOW()
   WHERE user_id=$4`,
      [full_name, phone, profile_image, userId],
    );
    if (role === "ADMIN") {
    } else if (role === "HOSPITAL") {
    } else if (role === "DONOR") {
      const { blood_group, gender, dob, weight, city, last_donation_date } =
        req.body;
      await pool.query(
        `UPDATE donors
   SET blood_group=$1,
       gender=$2,
       dob=$3,
       weight=$4,
       city=$5,
       last_donation_date=$6
   WHERE user_id=$7`,
        [blood_group, gender, dob, weight, city, last_donation_date, userId],
      );
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteProfile = async (req, res) => {
  res.json({
    message: "Delete Profile API",
  });
};
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
};
