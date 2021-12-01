const jwt = require("jsonwebtoken");

//To determine if user should be able to access the route 'Bearer tokenName'
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "super_secret_private_key_uncrackable_long_string");
    next();
  } catch (error) {
    res.status(401).json({ message: "Bad token!" });
  }
};
