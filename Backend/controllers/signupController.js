import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, floorNumber, roomNumber } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      password, // No bcrypt as per request
      floorNumber,
      roomNumber,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
};
