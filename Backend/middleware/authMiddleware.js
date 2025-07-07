const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

const authenticateAdmin = (req, res, next) => {
  authenticateUser(req, res, () => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });
};

module.exports = { authenticateUser, authenticateAdmin };
