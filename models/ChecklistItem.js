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
  },

  category: {
    type: String,
    enum: ["Clothes", "Documents", "Electronics", "Essentials", "Toiletries", "Other"],
    default: "Essentials"
  }

},
{ timestamps: true }
);

export default mongoose.model("ChecklistItem", checklistSchema);