const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const register = async (req, res) => {
  console.log("req.body =", req.body);

  // Store the user information from req.body with the hashed password in the database for security reasons.
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, user: { name: user.name }, token });
};

const login = async (req, res) => {
  console.log("req.body =", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password!");
  }

  const user = await User.findOne({ email });
  console.log(user)

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials!")
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials!")
  }
  
  const token = user.createJWT()
  return res.status(StatusCodes.OK).json({success: true, user: { name: user.name }, token})


};

module.exports = {
  register,
  login,
};
