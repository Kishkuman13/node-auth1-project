const Users = require('../users/users-model');

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).json({ message: 'You shall not pass!' });
  } else {
    next();
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const checkUser = Users.findBy(req.body.username)
  if (checkUser.username === req.body.username) {
    res.status(422).json({ message: 'Username taken' });
  } else {
    next();
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
// async function checkUsernameExists(req, res, next) {
//   const checkUser = await Users.findBy('asdf')
//   console.log(checkUser)
//   // if (!checkUser) {
//   //   res.status(422).json({ message: 'Invalid credentials' });
//   // } else {
//   //   next();
//   // }
// }

async function checkUsernameExists (req, res, next) {
  const [user] = await Users.findBy({username: req.body.username})
  if (!user) {
    res.status(401).json({ "message": "Invalid credentials" })
  } else {
    req.user = user;
    next();
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const checkPass = req.body.password;
  if (checkPass.length <= 3 || !checkPass) {
    res.status(422).json({ message: 'Password must be longer than 3 chars' });
  } else {
    next();
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists, 
  checkPasswordLength,
}
