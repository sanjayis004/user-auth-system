const db = require("../models");
const User = db.user;

checkDuplicateContact = (req, res, next) => {
  // Username
  console.log("re.body",req.body)
  User.findOne({
    where: {
      contact: req.body.contact
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        success:0,
        message: "contact is already in use!"
      });
      return;
    }

    // Email
    
  });
  next()
};


const signUp = {
  checkDuplicateContact
};

module.exports = signUp;