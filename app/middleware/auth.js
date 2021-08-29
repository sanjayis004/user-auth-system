//const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const db = require("../models");
const User = db.user;
const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient({
        "port": config.redis.PORT,
        "host": config.redis.HOST,
        "password":config.redis.PASSWORD,
        "options":
        {}
    });
const jwtr = new JWTR(redisClient);

verifyToken = async(req, res, next) => {
  let token = req.headers["x-access-token"];
console.log("token",token)

  if (!token) {
    return res.status(403).send({
      success:0,
      message: "No token provided!"
    });
  }
//console.log("jwtr",jwtr)
  let verificationRes 
  try{
   verificationRes = await  jwtr.verify(token, config.secret)
  console.log('verificationRes',verificationRes)
  }catch(e){
    if(e){
      return res.status(401).send({
        success:0,
        message: "Unauthorized!"
      }); 
    }
  }
    
    req.query.userId = verificationRes.id;
    req.query.jti = verificationRes.jti
    next();
  
};

// isAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then(user => {
//     user.getRoles().then(roles => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }

//       res.status(403).send({
//         message: "Require Admin Role!"
//       });
//       return;
//     });
//   });
// };




const auth = {
  verifyToken: verifyToken 
};
module.exports = auth