import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {

  try {

    const { activity, text } = req.body;

    const comment = await Comment.create({
      activity,
      text,
      user: req.user.id
    });

    res.status(201).json(comment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

export const getComments = async (req, res) => {

  try {

    const comments = await Comment.find({
      activity: req.params.activityId
    })
    .populate("user", "name");

    res.json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};