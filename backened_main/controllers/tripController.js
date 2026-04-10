import User from "../models/User.js";
import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    const { title, destination, travelers, budget, startDate, endDate } = req.body;
    const trip = await Trip.create({
      title,
      destination,
      travelers,
      budget,
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
    const trip = await Trip.findById(id).populate("members.user", "name email");
    
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
    
    if (token.length !== 24) {
      return res.status(400).json({ message: "Invalid invitation link" });
    }

    const trip = await Trip.findById(token);
    if (!trip) {
      return res.status(404).json({ message: "This trip no longer exists or the link is invalid." });
    }

    if (!trip.members) trip.members = [];

    const isMember = trip.members.some(m => m && m.user && String(m.user) === String(req.user.id));
    
    if (!isMember) {
      trip.members.push({ 
        user: req.user.id, 
        role: "editor" 
      });
      await trip.save();
    }

    res.json({ message: "Joined successfully", tripId: trip._id, trip });
  } catch (error) {
    console.error("Join Trip Error:", error);
    res.status(500).json({ message: "Internal server error while joining trip" });
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const { tripId, userId } = req.params;
    const { role } = req.body;

    if (!["admin", "editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Check if requester is admin/owner
    const requester = trip.members.find(m => String(m.user) === String(req.user.id));
    if (!requester || (requester.role !== "admin" && requester.role !== "owner")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const member = trip.members.find(m => String(m.user) === String(userId));
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.role = role;
    await trip.save();

    res.json({ message: "Role updated successfully", trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};