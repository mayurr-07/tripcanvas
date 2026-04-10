import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  destination: {
    type: String,
    default: ""
  },

  travelers: {
    type: Number,
    default: 1
  },

  budget: {
    type: Number,
    default: 0
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      role: {
        type: String,
        enum: ["owner", "editor", "viewer"],
        default: "viewer"
      }
    }
  ]
},
{ timestamps: true }
);

export default mongoose.model("Trip", tripSchema);