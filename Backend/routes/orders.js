import express from "express";
import Order from "../models/orderModel.js"; // Ensure this model exists

const router = express.Router();

// Create an order (POST request)
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    console.log("Received order:", req.body); // Debugging

    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({ 
      userId, 
      items, 
      totalAmount, 
      status: "Pending" // Default status
    });

    await newOrder.save();
    res.status(201).json({ 
      message: "Order placed successfully", 
      order: newOrder 
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all orders (GET request)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Show recent orders first
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (PATCH request)
router.patch("/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    // Only allow specific status updates
    const validStatuses = ["Pending", "Processing", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the order and update its status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ 
      message: "Order status updated successfully", 
      order // Returning updated order
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all orders for a specific user (GET request)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;
