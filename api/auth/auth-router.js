const Users = require("../users/users-model");

const router = require("express").Router(); //this is the router that will be exported, reformated single line

//all auth related things
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const jwt = require("jsonwebtoken");
const {
  checkUsernameExists,
  checkUsernameAvailable,
} = require("./auth-middleware");

router.post("/register", checkUsernameAvailable, (req, res, next) => {
  if (req.body.username && req.body.password) { //if username and password are provided
    let user = req.body;
    const hashRounds = process.env.BCRYPT_ROUNDS || 8; 
    const hash = bcrypt.hashSync(user.password, hashRounds);
    user.password = hash; //hash the password

    Users.add(user)
      .then((savedUser) => {
        res.status(201).json(savedUser); //send the user back
      })
      .catch(next);

  } else {
    res.status(400).json({ message: "username and password required" }); //code 400 is bad request
  }
});

//need for login
function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d", // could also say "1h" or "1w"
  };
  return jwt.sign(payload, JWT_SECRET, options); //could also say "jwt.sign(payload, JWT_SECRET, options, (err, token) => { return token; })"
}

router.post("/login", checkUsernameExists, (req, res, next) => {
  if (req.body.username && req.body.password) {
    
    let username = req.body.username;
    let password = req.body.password;

    //somehow not a fan of let { username, password } = req.body;
    //but it works for now

    Users.findBy({ username })
      .then(([user]) => { 
        if (user && bcrypt.compareSync(password, user.password)) { // if both username and password are correct/true
          const token = buildToken(user);
          res.status(200).json({
            message: `${user.username} is back`,
            token,
          });
          
        } else {
          next({ status: 401, message: "Invalid Credentials" }); //401 is unauthorized
        }
      })
      .catch(next);
  } else {
    res.status(400).json({ message: "username and password required" });
  }
});

module.exports = router;
