const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if(!token){
        return res.status(401).send("Please Login First");
    }
    const decodedMessage = await jwt.verify(token, "Dev@Tinder$790");
    // console.log(decodedMessage);//this will give us the _id of the user who is logged in. In an object format like this { _id: '64a0e3f5c7b1c2d3e4f5g6h7', iat: 1689000000 } 
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    // we have set the user to req.user as we have find the use from the database and we can use this user in the next middleware or route handler. So that we don't have to find the user again in the next middleware or route handler.
    req.user = user;
    req.id = _id
    next();

  } catch (error) {
        res.status(400).send("ERROR: "+error.message);
  }
};

module.exports = {
    userAuth,
}
