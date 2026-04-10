import express from "express";
import { createReservation, getReservations } from "../controllers/reservationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReservation);
router.get("/:tripId", authMiddleware, getReservations);

export default router;