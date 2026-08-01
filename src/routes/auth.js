const express = require('express')
const authRouter = express.Router()
//for encryption
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData, validateLogInData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  // this was for learning perpose(static methord)
  // const userObj = {

  //     firstName:"Deepak",
  //     lastName:"shrivas",
  //     emailId:"deepakshrivas442@gmail.com",
  //     password:"deepak@123",
  // }
  
  const { firstName, lastName, emailId, password } = req.body;
  try {
    //1)VALIDATION (api level validation of data)
    validateSignUpData(req);
    //2)Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    //real method by giving req.body to User model instance as it contain json data and middleware converts into js obj.
    // const user = new User(req.body);
    
    //but never EVER TRUST req.body so real method is this instead of new user(req.body);

    //3)new instance of User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    //this will save and send data to database
    await user.save();
    res.send("User Data Saved successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //validate Data.
    validateLogInData(req);

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("INVALID CRADENTIAL");  
    }
    //isPaswordValid and getJWT functions are helper function defined at the Schema level because this is more closer to the user and doing this is a production level thing ans also it makes thing reuseable.
    //isPasswordValid is a helper function
    const isPasswordValid = user.validatePassword(password)
    if (!isPasswordValid) {
      throw new Error("INVALID CRADENTIAL");
    } else {
      //creating web token after ispasswordvalidation ..
      //getJWT is a helper function
      const token = await user.getJWT()
      //adding token to cookie  and send it to the user so that when user make a req for /profile etc server can authenticate
      res.cookie("token", token,{expires: new Date(Date.now() + 8 * 36000000)});
      res.status(200).send("Login Successfull.");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post('/logout',(req,res)=>{
  res.clearCookie("token")
  res.status(200).send("Logout successfull.")
})

module.exports = authRouter;