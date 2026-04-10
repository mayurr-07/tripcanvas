import attachmentRoutes from "./routes/attachmentRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import checklistRoutes from "./routes/checklistRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: ["https://tripcanvas.pages.dev", "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));
app.options("*", cors());
app.use(express.json());

app.use("/api/attachments", attachmentRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
    res.send("Trip Planner API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});