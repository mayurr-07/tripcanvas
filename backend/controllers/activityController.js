import Activity from "../models/Activity.js";

export const createActivity = async (req, res) => {

  try {

    const { trip, title, location, time, day } = req.body;

    const activity = await Activity.create({
      trip,
      title,
      location,
      time,
      day
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