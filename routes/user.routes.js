const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const userRouter = express.Router();

userRouter.use(express.json());
userRouter.post("/register", (req, res) => {
  const { username, email, pass } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (hash) {
        const user = new UserModel({
          username,
          email,
          pass: hash,
        });
        await user.save();
        res.status(200).json({ msg: "User registered successfully" });
      } else {
        res.status(200).json({ err });
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    bcrypt.compare(pass, user.pass, (err, result) => {
      console.log(result);
      if (result) {
        const token = jwt.sign(
          { userId: user._id, username: user.username },
          "masai"
        );
        res.json({ token });
      } else {
        res.json({ err });
      }
    });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = { userRouter };
