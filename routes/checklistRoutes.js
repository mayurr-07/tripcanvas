import express from "express";
import {
  createChecklistItem,
  getChecklist,
  toggleChecklistItem,
  deleteChecklistItem
} from "../controllers/checklistController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChecklistItem);

router.get("/:tripId", authMiddleware, getChecklist);

router.patch("/:id/toggle", authMiddleware, toggleChecklistItem);

router.delete("/:id", authMiddleware, deleteChecklistItem);

export default router;