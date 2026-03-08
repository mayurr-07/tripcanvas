import express from "express";
import { createTrip, getTrips, inviteMember, getTripById, updateTrip } from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/:tripId", authMiddleware, getTripById);
router.put("/:tripId", authMiddleware, updateTrip);
router.post("/:tripId/invite", authMiddleware, inviteMember);

export default router;