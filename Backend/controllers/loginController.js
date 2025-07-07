import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      console.log("❌ Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    const secretKey = process.env.JWT_SECRET || "default_secret_key"; // ✅ Add default

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secretKey,
      { expiresIn: "1h" }
    );

    const userid = user._id;

    console.log("✅ Login successful:", { token, role: user.role ,id: user._id});

    res.status(200).json({ message: "Login successful", 
                            token, role: user.role,userid});
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
