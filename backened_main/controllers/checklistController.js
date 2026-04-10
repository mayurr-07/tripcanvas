import ChecklistItem from "../models/ChecklistItem.js";

export const createChecklistItem = async (req, res) => {
  try {

    const { trip, tripId, text } = req.body;

    const item = await ChecklistItem.create({
      trip: trip || tripId,
      text
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChecklist = async (req, res) => {
  try {

    const items = await ChecklistItem.find({
      trip: req.params.tripId
    });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleChecklistItem = async (req, res) => {
  try {

    const item = await ChecklistItem.findById(req.params.id);

    item.completed = !item.completed;

    await item.save();

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};