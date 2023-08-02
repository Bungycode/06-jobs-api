const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  console.log("req.headers =", req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid!");
  }

  const token = authHeader.split(" ")[1];
  console.log("token =", token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload =", payload);

    // This is the alternative method the instructor stated we could use if we don't store the payload data in an object in req.user for attaching to the job routes.
    // const user = await User.findById(payload.userId).select("-password")
    // console.log("user =", user)

    // attach the user to the job routes.
    req.user = { userId: payload.userId, name: payload.name };
    next()
  } catch (error) {
    console.log(error)
    throw new UnauthenticatedError("Authentication invalid!");
  }
};

module.exports = auth;
