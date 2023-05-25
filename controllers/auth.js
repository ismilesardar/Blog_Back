//package Required
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/auth.js");
const { JWT_KEY } = require("../helpers/constant");

//module scaffolded
const authCont = {};

authCont.register = async (req, res) => {
  try {
    // 1. destructure name, email, password from req.body
    const { name, email, password } = req.body;
    // 2. all fields require validation
    if (!name.trim()) {
      return res.status(404).json({ error: "Name is Required!" });
    }
    if (!email.trim()) {
      return res.status(404).json({ error: "E-mail is Required!" });
    }
    if (!password.trim() || password.length < 6) {
      return res
        .status(404)
        .json({ error: "Password must be at least 6 characters long!" });
    }
    // 3. check if email is taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ error: "E-mail is already taken!" });
    }
    // 4. hash password
    const passwordHash = await hashPassword(password);
    // 5. register customer
    const newUser = await new User({
      name,
      email,
      password: passwordHash,
    }).save();
    // 7. send response
    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

//login controller
authCont.login = async (req, res) => {
  try {
    // 1. destructure name, email, password from req.body
    const { email, password } = req.body;
    // 2. all fields require validation
    if (!email.trim()) {
      return res.status(404).json({ error: "E-mail is Required!" });
    }
    if (!password.trim() || password.length < 6) {
      return res
        .status(404)
        .json({ error: "Password must be at least 6 characters long!" });
    }
    // 3. check if email is taken
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Customer not found!" });
    }
    // 4. compare password
    const match = await comparePassword(password, existingUser.password);
    if (!match) {
      return res.status(404).json({ error: "Rona password!" });
    }
    // 5. create signed jwt
    const token = jwt.sign(
      { _id: existingUser._id, name: existingUser.name },
      JWT_KEY,
      {
        expiresIn: "7d",
      }
    );
    // 7. send response
    res.status(201).json({
      user: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

authCont.isLogin = (req, res) => {
  res.status(200).json({ ok: true });
};

module.exports = authCont;
