import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
{
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip"
  },

  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity"
  },

  file: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true }
);

export default mongoose.model("Attachment", attachmentSchema);