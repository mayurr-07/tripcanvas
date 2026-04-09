import express from "express";
import upload from "../middleware/upload.js";
import { uploadFile } from "../controllers/attachmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), uploadFile);

export default router;