import Attachment from "../models/Attachment.js";

export const uploadFile = async (req, res) => {

  try {

    const attachment = await Attachment.create({
      trip: req.body.trip,
      file: req.file.filename,
      uploadedBy: req.user.id
    });

    res.status(201).json(attachment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};