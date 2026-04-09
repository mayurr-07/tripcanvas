import ChecklistItem from "../models/ChecklistItem.js";

export const createChecklistItem = async (req, res) => {
  try {
    const { trip, text, item, category } = req.body;
    const itemText = text || item;

    const checklistItem = await ChecklistItem.create({
      trip,
      text: itemText,
      category: category || "Essentials"
    });

    res.status(201).json(checklistItem);

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

export const deleteChecklistItem = async (req, res) => {
  try {
    const item = await ChecklistItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};