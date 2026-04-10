import express from "express";
import { createTrip, getTrips, getTrip, inviteMember } from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/:id", authMiddleware, getTrip);
router.post("/:tripId/invite", authMiddleware, inviteMember);

export default router;