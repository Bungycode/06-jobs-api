const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name!"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide an email address!"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address!",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
  },
});

// utilizing a mongoose pre hook for taking the user's password and hashing it. Used next function to continue onto the next middleware but it is not needed for this to work.
UserSchema.pre("save", async function () {
  // This line of code generates 10 rounds of random bytes. The bigger the number passed in, the more random bytes we get which also means the more secure the password is going to be. Also keep in mind, the more rounds you have, the more processing power is going to be required. The instructor went with 10 rounds which I believe is the default value. This is a very secure password.
  const salt = await bcrypt.genSalt(10);
  // Then we take those random bytes generated through the genSalt method and pass them in the hash method. The hash method looks for the password we want to hash as well as the salt. Once we provide both of those values, as a result we get back that hashed password and store it in the password variable using the "this" keyword.
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = function (candidatePassword) {
  const isMatch = bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
