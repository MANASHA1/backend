import User from '../models/User.js';
import jwt from "jsonwebtoken";

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    // 2️⃣ Check password
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    // 3️⃣ Generate tokens
    const accessToken = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
       "mySuperSecretKey",
      { expiresIn: "15m" } // short-lived access token
    );

    console.log(accessToken);
    


    // 4️⃣ Send access token in httpOnly cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 minutes
    });


    res.json({ message: "Logged in"});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Logout Controller
export const logout = async (req, res) => {
  try {
    // Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });

    // Optional: revoke refresh token in DB if stored

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
