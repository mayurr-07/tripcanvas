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
    
    const ownedTrips = trips.filter(t => String(t.owner) === String(req.user.id));
    const sharedTrips = trips.filter(t => String(t.owner) !== String(req.user.id));

    res.json({ ownedTrips, sharedTrips });
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

export const getTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    
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
    const { id } = req.params;
    const updates = req.body;
    
    const trip = await Trip.findByIdAndUpdate(id, updates, { new: true });
    
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateInvite = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const code = String(trip._id);
    const link = `https://tripcanvas.pages.dev/join/${code}`;
    res.json({ link, code });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinTrip = async (req, res) => {
  try {
    const { token } = req.params;
    const trip = await Trip.findById(token);
    if (!trip) return res.status(404).json({ message: "Trip not found or invalid link" });

    const isMember = trip.members.some(m => String(m.user) === String(req.user.id));
    if (!isMember) {
      trip.members.push({ user: req.user.id, role: "viewer" });
      await trip.save();
    }

    res.json({ message: "Successfully joined trip", trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};