//require package
const jwt =require("jsonwebtoken");
const User = require('../models/user');
const { JWT_KEY } = require("../helpers/constant");
//Role verify
exports.isAdmin = async (req,res,next) => {
    try {
        const user = await User.findById(req.user._id);
        // console.log(user);
        if (user['role'] !== 1) {
            return res.status(401).json("Unauthorized");
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

exports.isSigning = async (req,res,next) => {
    try {
        const decoded = jwt.verify(
            req.headers.authorization,
            JWT_KEY
        );
        // console.log(decoded)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(error);
    }
}