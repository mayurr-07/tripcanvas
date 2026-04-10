import Attachment from "../models/Attachment.js";

export const uploadFile = async (req, res) => {

  try {
    const { trip, tripId, activity, activityId } = req.body;

    const attachment = await Attachment.create({
      trip: trip || tripId,
      activity: activity || activityId,
      file: req.file.filename,
      uploadedBy: req.user.id
    });

    res.status(201).json(attachment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};