import express from "express";
import { createTrip, getTrips, getTrip, updateTrip, inviteMember, generateInvite, joinTrip } from "../controllers/tripController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/:id", authMiddleware, getTrip);
router.put("/:id", authMiddleware, updateTrip);
router.post("/:tripId/invite", authMiddleware, inviteMember);
router.post("/:tripId/generate-invite", authMiddleware, generateInvite);
router.post("/join/:token", authMiddleware, joinTrip);

export default router;