const JWT_SECRET = process.env.JWT_SECRET || "secret";
const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next({ status: 401, message: "token required" });
  }
  //to verify we have a token and if it is valid we need to use the jwt.verify method
  jwt.verify(token, JWT_SECRET, (err, decoded) => { 
    if (err) {
      return next({
        status: 401,
        message: "Token invalid",
      });
    }
    req.decodedJwt = decoded; // this is the decoded token
    next();
  });
};
