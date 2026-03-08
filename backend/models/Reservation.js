import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
{
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  type: {
    type: String,
    enum: ["hotel", "flight", "bus", "train", "other"],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  date: Date,

  notes: String
},
{ timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);