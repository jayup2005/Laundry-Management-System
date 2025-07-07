import express from "express";
import User from "../models/User.js";
import mongoose from "mongoose";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const users = await User.find({ role: "User" }); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

 
  router.patch("/update-balance/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { balance } = req.body; // Ensure this matches frontend request
  
      console.log("New Balance:", balance);
  
      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
        
      }
  
      // Update the user's balance and return the updated user
      const user = await User.findByIdAndUpdate(userId, { balance }, { new: true });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ balance: user.balance }); // Send updated balance
    } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

export default router;

  
