import express from "express";
import { createTrip, getTrips, inviteMember } from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.post("/:tripId/invite", authMiddleware, inviteMember);

export default router;