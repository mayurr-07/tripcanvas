import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
{
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  splitAmong: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  category: {
    type: String,
    enum: ["Transportation", "Dining", "Activities", "Shopping", "Health", "Other"],
    default: "Dining"
  }

},
{ timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);