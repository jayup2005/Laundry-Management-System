import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, // No hashing
    },
    floorNumber: {
      type: Number,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 1500, // Initialize the balance to 1500 for new users
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User", // Default role is User
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
