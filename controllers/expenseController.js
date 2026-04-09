import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";

export const addExpense = async (req, res) => {
  try {
    const { trip, title, amount, splitAmong, category } = req.body;

    const expense = await Expense.create({
      trip,
      title,
      amount,
      paidBy: req.user.id,
      splitAmong: splitAmong || [],
      category: category || "Dining"
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {

  try {

    const expenses = await Expense.find({
      trip: req.params.tripId
    });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

export const getExpenseSummary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const currentUserId = req.user.id;

    const expenses = await Expense.find({ trip: tripId });
    const trip = await Trip.findById(tripId).populate("members.user");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Group by category
    const categories = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // Splitting logic
    // We want to know how much the CURRENT USER owes or is owed
    let userOwes = 0;
    let userGetsBack = 0;

    expenses.forEach(exp => {
      const share = exp.amount / (exp.splitAmong.length || 1);
      const isPayer = exp.paidBy.toString() === currentUserId;
      const isInSplit = exp.splitAmong.some(id => id.toString() === currentUserId);

      if (isPayer) {
        // I paid. Others in splitAmong owe me their share.
        // My own share is NOT 'gets back'.
        const othersShare = exp.amount - (isInSplit ? share : 0);
        userGetsBack += othersShare;
      } else if (isInSplit) {
        // Someone else paid, but I am in split. I owe my share.
        userOwes += share;
      }
    });

    res.json({
      total,
      perPerson: total / (trip.members.length || 1),
      count: expenses.length,
      categories,
      balances: {
        owes: userOwes,
        getsBack: userGetsBack,
        net: userGetsBack - userOwes
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};