// middleware/authorize.js
//export const authorizeAdmin = (req, res, next) => {
  //try {
    // req.user should be set by authMiddleware
    //if (!req.user) {
      //return res.status(401).json({ message: "Unauthorized" });
    //}

    //if (req.user.role !== "admin") {
     // return res.status(403).json({ message: "Forbidden: Admins only" });
    //}

    //next(); // user is admin → proceed
  //} catch (err) {
    //res.status(500).json({ message: "Server error", error: err.message });
  //}
//};

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}
