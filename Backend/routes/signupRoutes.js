import express from "express";
import { signup } from "../controllers/signupController.js";

const router = express.Router();

router.post("/", signup); // POST /signup

export default router;
