const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData,validateForgotPasswordData } = require("../utils/validation");
const bcrypt = require("bcrypt");

//here userAuth middleware act as a authentication ..
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //req.user is set in the *userAuth middleware after finding the user from the database using the _id from the decoded token. So we can use req.user here to get the user data.
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const data = req.body;
  try {
    validateEditProfileData(req);
    const userId = req.id;
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  const { password } = req.body;
  const userId = req.id;
  try {
    validateForgotPasswordData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword }, //extract the password from the request body and hash it before updating the user document in the database.
      {
        // returnDocument: "after", i was written i older version now  we use new:true
        returnDocument:"after",
        runValidators: true,
      },
    );
    res.status(200).send("Password updated successfully.");
  } catch (error) {
    res.status(400).send("Error: " + error.message)
  }
});

module.exports = profileRouter;
