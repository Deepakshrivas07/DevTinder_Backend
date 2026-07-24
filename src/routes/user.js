const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async(req, res) => {
  try {
    const userRequests = await ConnectionRequestModel.find({
      toUserId: req.id, //req.id from userAuth
      status: "interested",
    }).populate("fromUserId","firstName lastName photoUrl age gender skills");
      //populate and ref use to make relation btwn to schema ref used in UserSchema model and 
      //populate used to take that get the info from User schema.populate is like a foreign key

    //using map over userRequest to get the exact data of user else it give the whole object of connection  
    const data = userRequests.map((row)=>row.fromUserId);

    res.status(200).json({
      message: "Data Retrived Successfully.",
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});



module.exports = userRouter;