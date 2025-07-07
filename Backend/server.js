import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import signupRoutes from "./routes/signupRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import userroute from './routes/user.js'
import orderoute from"./routes/orders.js"
import Order from "./models/orderModel.js"; // Import Order Model
import User from "./models/User.js"; // Import User Model
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend access

// Routes
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/users",userroute);
app.use("/orders",orderoute);
app.get("/users/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// MongoDB Connection
mongoose
  .connect("mongodb+srv://jayup2005:jaypatel123@cluster0.v92e3.mongodb.net/Laundry", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
