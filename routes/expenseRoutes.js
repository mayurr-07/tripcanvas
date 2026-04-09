import express from "express";
import {
  addExpense,
  getExpenses,
  getExpenseSummary,
  deleteExpense
} from "../controllers/expenseController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);

router.get("/:tripId", authMiddleware, getExpenses);

router.get("/:tripId/summary", authMiddleware, getExpenseSummary);

router.delete("/:id", authMiddleware, deleteExpense);

export default router;