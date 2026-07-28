const register = async (req, res) => {
  try {
    const { full_name, email, phone, password, role } = req.body;
    if (!full_name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    res.status(201).json({
      message: "User registered successfully",
      user: { full_name, email, phone, role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    res.status(200).json({
      message: "User logged in successfully",
      user: { email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  res.json({
    message: "Profile API",
  });
};

const updateProfile = async (req, res) => {
  res.json({
    message: "Update Profile API",
  });
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
