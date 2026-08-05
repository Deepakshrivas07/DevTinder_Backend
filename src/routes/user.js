const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about age gender skills"

userRouter.get("/user/requests/received", userAuth, async(req, res) => {
  try {
    const userRequests = await ConnectionRequestModel.find({
      toUserId: req.id, //req.id from userAuth
      status: "interested",
    }).populate("fromUserId",USER_SAFE_DATA);
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

userRouter.get('/user/connections',userAuth,async(req,res)=>{
  try {
    const loggedInUserId = req.id;
    const userConnections = await ConnectionRequestModel.find({
      $or:[
        {toUserId:loggedInUserId,status:"accepted"},
        {fromUserId:loggedInUserId,status:"accepted"}
      ]
    })
    .populate("fromUserId",USER_SAFE_DATA)
    .populate("toUserId",USER_SAFE_DATA)
    const data = userConnections.map((row)=>{
      if(row.fromUserId.equals(loggedInUserId)){
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message:"Data fetch successfull.",
      data,
    })
  } catch (error) {
    res.status(400).send("ERROR: "+error.message)
  }
})

//pagination concept to see only limited user at single time REMEMBER PAGINATION CONCEPT WORKS in GET API.
userRouter.get('/feed',userAuth,async(req,res)=>{
 try {
      const page = parseInt(req.query.page) || 1;  //query means when url have ?page=1  and params /:page to clearify the difference 
      let limit = parseInt(req.query.limit) || 10; //query means when url have  ?limit=10
      //if someone(attacker) trys get limit =1000 or more so,
      limit > 50 ? 50 :limit //if limit >50 then it will set limit =50 else if less the limit will what it has in query
      const skip = (page-1)*limit; //formula to skip
      const loggedInUser = req.id;
  //will find the id's who is having connecton with the loggedin user either its fromUserId is loggedInUser or toUserId is loggedInUser.
  const connectionRequests = await ConnectionRequestModel.find({
    $or:[
      {fromUserId:loggedInUser},
      {toUserId:loggedInUser}
    ]
  }).select("fromUserId toUserId")

  const hideUserFromFeed = new Set()  //set data structure used to avoid dublicate id
  connectionRequests.forEach((req)=>{
    hideUserFromFeed.add(req.fromUserId.toString())
    hideUserFromFeed.add(req.toUserId.toString())
  })
  // console.log(hideUserFromFeed)
  const users = await User.find({
    $and:[
      {_id:{$nin: Array.from(hideUserFromFeed)}} , // $nin stands for not in its a mongoose schema thing
      {_id:{$ne:loggedInUser}} // $ne = not equal
    ]
  }).select(USER_SAFE_DATA) //select method used to select only  specific data u want to get and work from the User schema.
    .skip(skip) // mongodb provide skip method for pagination to skip the page
    .limit(limit) // mongodb provide limit method for pagination to limit the page
    res.send(users)
 } catch (error) {
    res.status(400).send("ERROR : "+ error.message)
 }
})

module.exports = userRouter;