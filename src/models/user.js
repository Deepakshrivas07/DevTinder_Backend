const mongoose = require("mongoose");
// validator is a third party library which is used to validate the data. it has various methods like isEmail, isStrongPassword, isURL etc. which can be used to validate the data.
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const { default: isURL } = require("validator/lib/isURL");
const userSchema = new mongoose.Schema( //or we can write new schema({}) if we import const {schema} = mongoose
  { 
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true, //if we put fields as UNIQUE express automatically creates index to retreive query faster.
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid Email address: " +value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Enter strong password Should have 1-Uppercase,1-SpecialCharacter,MinimumLength(6)",
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      trim: true,
    },
    gender: {
      type: String,
      lowercase: true,
      enum:{
        values:["male", "female", "other"],
        message:`{VALUE} is not a valid gender type`
      },
      //or can add custom validator
      // validate(value){
      //   if(!["male","female","other"].includes(value)){
      //     throw new Error("Gender is not valid")
      //   }
      // }
    },
    photoUrl: {
      type: String,
      validate: {
        validator(value) {
          if (!isURL(value)) {
            throw new Error("Invalid Photo URL: " + value);
          }
        },
      },
      default:
        "https://avatars.githubusercontent.com/u/146703548?v=4",
    },
    about:{
      type:String,
      minLength:10,
      maxLength:100,
    },
    skills: {
      type: [
        {
          type: String,
          minLength: 2,
          maxLength: 10,
          trim: true,
        },
      ],
      validate: [
        {
          validator: (arr) => arr.length <= 10,
          message: "skills cannot be more than 10",
        },
      ],
    },
  },
  { timestamps: true }, // it will create two fields created and updated at timestamp in the document automatically
);

// this are helper methods
userSchema.methods.getJWT = async function(){
  //this refers to the current instances
  const  user = this
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$790",{expiresIn: "7d"});
  return token;
}
userSchema.methods.validatePassword = async function(inputPassword){
  //this refers to the current instances
  const user = this
  const passwordHashed = user.password;
  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHashed)
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
