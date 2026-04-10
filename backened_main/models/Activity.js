import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
{
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  location: {
    type: String
  },

  time: {
    type: String
  },

  day: {
    type: Number,
    required: true
  },

  notes: {
    type: String,
    default: ""
  },

  order: {
    type: Number,
    default: 0
  }

},
{ timestamps: true }
);

export default mongoose.model("Activity", activitySchema);