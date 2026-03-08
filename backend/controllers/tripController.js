import User from "../models/User.js";
import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    const trip = await Trip.create({
      title,
      startDate,
      endDate,
      owner: req.user.id,
      members: [{ user: req.user.id, role: "owner" }]
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      "members.user": req.user.id
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { tripId } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.members.push({
      user: user._id,
      role: role || "viewer"
    });

    await trip.save();

    res.json({ message: "User invited successfully", trip });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findOne({
      _id: tripId,
      "members.user": req.user.id
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Using findOneAndUpdate ensures we only update if the user is a member
    const trip = await Trip.findOneAndUpdate(
      { _id: tripId, "members.user": req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized to update" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};