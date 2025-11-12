import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token; // httpOnly cookie
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, 'mySuperSecretKey'); // replace with process.env.JWT_SECRET later
    req.user = decoded; // attach decoded info (userId, role) to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};