import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
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
        enum: ["admin", "editor", "viewer"],
        default: "viewer"
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  inviteToken: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  }
},
{ timestamps: true }
);

export default mongoose.model("Trip", tripSchema);