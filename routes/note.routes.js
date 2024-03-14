const express = require("express");
const { NoteModel } = require("../model/note.model");
const { auth } = require("../middlewares/auth.middleware");

const noteRouter = express.Router();
noteRouter.post("/", auth, async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.json({ msg: "New Note has been added" });
  } catch (error) {
    res.json(error);
  }
});

noteRouter.get("/", auth, async (req, res) => {
  try {
    const notes = await NoteModel.find({ userId: req.body.userId });

    res.json({ notes });
  } catch (error) {
    res.json(error);
  }
});

noteRouter.patch("/:noteID", auth, async (req, res) => {
  const payload = req.body;

  const { noteID } = req.params;
  console.log(noteID);
  try {
    const note = await NoteModel.findOne({ _id: noteID });
    if (req.body.userId === note.userId) {
      await NoteModel.findByIdAndUpdate(noteID, payload);
      res.json({ msg: `Note with Id ${noteID} has been updated` });
    } else {
      res.json({
        msg: "You dont have the access to modify someone else's note",
      });
    }
  } catch (error) {
    res.json({ error });
  }
});

noteRouter.delete("/:noteID", auth, async (req, res) => {
  const { noteID } = req.params;
  try {
    const note = await NoteModel.findOne({ _id: noteID });
    if (req.body.userId === note.userId) {
      await NoteModel.findByIdAndDelete(noteID);
      res.json({ msg: `Note with Id ${noteID} has been deleted` });
    } else {
      res.json({
        msg: "You dont have the access to delete someone else's note",
      });
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = { noteRouter };
