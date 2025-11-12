// middleware/authorize.js
export const authorizeAdmin = (req, res, next) => {
  try {
    // req.user should be set by authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next(); // user is admin → proceed
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};