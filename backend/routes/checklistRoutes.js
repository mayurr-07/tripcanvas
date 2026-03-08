import express from "express";
import {
  createChecklistItem,
  getChecklist,
  toggleChecklistItem
} from "../controllers/checklistController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChecklistItem);

router.get("/:tripId", authMiddleware, getChecklist);

router.patch("/:id/toggle", authMiddleware, toggleChecklistItem);

export default router;