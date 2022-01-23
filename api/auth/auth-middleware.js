const Auth = require("../users/users-model"); //this is the middleware that checks if the username is available/valid
const { findBy } = require("../users/users-model");

const checkUsernameAvailable = async (req, res, next) => {
  if (!req.body.username || !req.body.password) { //if username or password is not provided
    next();
  } else { //if username or password is provided
    const username = req.body.username;
    const userExists = await Auth.findBy({ username });
    if (userExists.length > 0) { //if username is already taken
      res.status(401).json({ message: "username taken" });
    } else {
      next();
    }
  }
};

const checkUsernameExists = async (req, res, next) => {
  const username = req.body.username;
  const exists = await findBy({ username }).first(); //check if username exists
  if (!exists) {
    res.status(401).json({ message: "username taken" }); //logic might be backwards, will check later if off
    //is correct, but still confuses me. exists checks username is there, not exist should be true if username is not taken?
    //I suppose it's the other way around
  } else {
    next();
  }
};

module.exports = {
  checkUsernameExists,
  checkUsernameAvailable,
};
