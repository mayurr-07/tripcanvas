import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";

export const addExpense = async (req, res) => {

  try {

    const { trip, tripId, title, amount } = req.body;

    const expense = await Expense.create({
      trip: trip || tripId,
      title,
      amount,
      paidBy: req.user.id
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

    const expenses = await Expense.find({
      trip: req.params.tripId
    });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const trip = await Trip.findById(req.params.tripId);

    const perPerson = total / trip.members.length;

    res.json({
      total,
      perPerson,
      count: expenses.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};