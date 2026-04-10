import Activity from "../models/Activity.js";

export const createActivity = async (req, res) => {

  try {

    const { trip, tripId, title, location, time, day, notes } = req.body;

    const activity = await Activity.create({
      trip: trip || tripId,
      title,
      location,
      time,
      day: day || 1,
      notes: notes || ""
    });

    res.status(201).json(activity);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


export const getActivities = async (req, res) => {

  try {

    const activities = await Activity.find({
      trip: req.params.tripId
    }).sort({ order: 1 });

    res.json(activities);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};