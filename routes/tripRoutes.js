import express from "express";
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  inviteMember,
  generateInviteToken,
  joinTrip
} from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/:id", authMiddleware, getTrip);
router.put("/:id", authMiddleware, updateTrip);
router.post("/:id/invite", authMiddleware, generateInviteToken);
router.post("/join/:token", authMiddleware, joinTrip);

export default router;