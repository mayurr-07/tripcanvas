import crypto from "crypto";
import User from "../models/User.js";
import Trip from "../models/Trip.js";
import ChecklistItem from "../models/ChecklistItem.js";
import Expense from "../models/Expense.js";
import Activity from "../models/Activity.js";

export const createTrip = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    const trip = await Trip.create({
      title,
      startDate,
      endDate,
      owner: req.user.id,
      members: [{
        user: req.user.id,
        role: "admin",
        joinedAt: new Date()
      }]
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { owner: req.user.id },
        { "members.user": req.user.id }
      ]
    }).populate("members.user", "name email avatar");

    const ownedTrips = trips.filter(t => t.owner.toString() === req.user.id);
    const sharedTrips = trips.filter(t => t.owner.toString() !== req.user.id);

    res.json({ ownedTrips, sharedTrips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateInviteToken = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GENERATING LINK FOR TRIP:", id);
    let trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Role check: Only admin or editor can invite
    console.log("SEARCHING FOR USER IN TRIP MEMBERS:", req.user.id);
    const userMember = trip.members.find(m => {
      const memberId = m.user ? m.user.toString() : "";
      return memberId === req.user.id;
    });

    console.log("USER MEMBER FOUND:", userMember);

    const currentUserId = req.user.id.toString();
    const isOwner = trip.owner && trip.owner.toString() === currentUserId;
    const role = userMember ? userMember.role : "none";
    
    console.log("ROLE CHECK COMPARISON:", { 
      role, 
      isOwner, 
      tripOwner: trip.owner ? trip.owner.toString() : "none", 
      currentUserId 
    });

    if (!isOwner && (!userMember || (role !== "owner" && role !== "admin" && role !== "editor"))) {
      console.log("ACCESS DENIED: NOT AUTHORIZED");
      return res.status(403).json({ message: "Not authorized to invite" });
    }

    // Goal 1.A: Ensure token exists before response
    if (!trip.inviteToken) {
      trip.inviteToken = crypto.randomBytes(16).toString("hex");
      await trip.save();
    }

    console.log("INVITE TOKEN:", trip.inviteToken);

    res.json({
      link: `${req.headers.origin || 'http://localhost:5173'}/join-trip/${trip.inviteToken}`,
      code: trip.inviteToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinTrip = async (req, res) => {
  try {
    const { token } = req.params;
    // 1. Find trip
    const trip = await Trip.findOne({ inviteToken: token });

    // 2. If not found
    if (!trip) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    // 3. FIX MEMBERS CHECK
    const alreadyMember = trip.members.some(
      (m) => m.user.toString() === req.user.id.toString()
    );

    if (alreadyMember) {
      return res.json({ message: "Already joined", trip });
    }

    // 4. If not member
    trip.members.push({
      user: req.user.id,
      role: "viewer",
      joinedAt: new Date()
    });

    // 5. Save trip
    await trip.save();

    // 6. Return
    const updatedTrip = await Trip.findById(trip._id).populate("members.user", "name email avatar");
    res.json({ message: "Joined successfully", trip: updatedTrip });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { title, startDate, endDate, budget } = req.body;
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { title, startDate, endDate, budget },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
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