const validator = require("validator");
const express = require("express");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Keep password Strong");
  }
};
const validateLogInData = (req) => {
  const { emailId } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid E-mail");
  }
};

const validateEditProfileData = (req) => {
  const data = req.body;

  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];

  const isAllowed = Object.keys(data).every((key) =>
    allowedEditFields.includes(key),
  );

  if (!isAllowed) {
    throw new Error("Invalid update fields.");
  }

  // Validate firstName
  if (
    data.firstName !== undefined &&
    (typeof data.firstName !== "string" || data.firstName.trim().length === 0)
  ) {
    throw new Error("Please enter a valid first name.");
  }

  // Validate lastName
  if (
    data.lastName !== undefined &&
    (typeof data.lastName !== "string" || data.lastName.trim().length === 0)
  ) {
    throw new Error("Please enter a valid last name.");
  }

  // Validate age
  console.log("Age:", data.age);
  console.log("isInteger:", Number.isInteger(data.age));
  console.log("Less than 1:", data.age < 1);
  console.log("Greater than 90:", data.age > 90);
  if (
    data.age !== undefined &&
    (!Number.isInteger(data.age) || data.age < 1 || data.age > 90)
  ) {
    throw new Error("Please enter a valid age.");
  }

  // Validate gender
  if (
    data.gender !== undefined &&
    (typeof data.gender !== "string" ||
      !["male", "female", "other"].includes(data.gender.toLowerCase()))
  ) {
    throw new Error("Gender must be male, female, or other.");
  }

  // Validate about
  if (
    data.about !== undefined &&
    (typeof data.about !== "string" || data.about.trim().length > 200)
  ) {
    throw new Error("About must be less than 200 characters.");
  }

  // Validate photoUrl
  if (
    data.photoUrl !== undefined &&
    (typeof data.photoUrl !== "string" || !validator.isURL(data.photoUrl))
  ) {
    throw new Error("Invalid photoUrl.");
  }

  // Validate skills
  if (data.skills !== undefined) {
    if (!Array.isArray(data.skills)) {
      throw new Error("Skills must be an array.");
    }

    if (data.skills.length > 10) {
      throw new Error("You can add a maximum of 10 skills.");
    }

    const areAllStrings = data.skills.every(
      (skill) => typeof skill === "string" && skill.trim().length > 0,
    );

    if (!areAllStrings) {
      throw new Error("Each skill must be a valid string.");
    }
  }

  return true;
};

const validateForgotPasswordData = function (req) {
  const data = req.body;
  const allowedField = ["password"];
  const isallowed = Object.keys(data).every((key) =>
    allowedField.includes(key),
  );
  if (!isallowed) {
    throw new Error("Only password is allowed to update.");
  }
  if (!data.password) {
    throw new Error("Password is required.");
  }
  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Pls Enter Strong Password!!");
  }
  return true;
};

module.exports = {
  validateSignUpData,
  validateLogInData,
  validateEditProfileData,
  validateForgotPasswordData,
};
