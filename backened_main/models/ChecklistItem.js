import mongoose from "mongoose";

const checklistSchema = new mongoose.Schema(
{
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },

  text: {
    type: String,
    required: true
  },

  completed: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

export default mongoose.model("ChecklistItem", checklistSchema);