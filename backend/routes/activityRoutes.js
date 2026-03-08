import express from "express";
import { createActivity, getActivities } from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createActivity);
router.get("/:tripId", authMiddleware, getActivities);

export default router;