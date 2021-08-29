const db = require("../models");
const config = require("../config/config");
const User = db.user;

const Joi = require('@hapi/joi')
//var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient({
        "port": 6379,
        "host": "localhost",
        "db": 8,
        "options":
        {}
    });
const jwtr = new JWTR(redisClient);


exports.signup = (req, res) => {
  // Save User to Database
  //console.log("Userr",User)
  const schema = Joi.object().keys({
    body:{
      name:Joi.string().required(),
      contact:Joi.string().required(),
      address:Joi.string().required(),
      gender:Joi.string().required(),
      country:Joi.string().required(),
      password:Joi.string().required()
    }
  })
  let request = {body:req.body}
  let joi_result = schema.validate(request)
  let error = joi_result.error
  if(error){
    res.status(400).send({
      success:0,
      error:error.details[0].message,
      message:"Invalid request"
    })

  }else {
    User.create({
      name: req.body.name,
      contact: req.body.contact,
      address:req.body.address,
      gender:req.body.gender,
      country:req.body.country,
      password: bcrypt.hashSync(req.body.password, 8)
    })
      .then(user => {
        res.status(200).send({
          success:1,
          message:"user created successfully!"
        })
      })
      .catch(err => {
        //console.log("Err",err)
        res.status(500).send({ 
          success:0,
          message: err.message });
      });

  }

  
};

exports.signin = (req, res) => {
  const schema = Joi.object().keys({
    body:{
      contact:Joi.string().required(),
      password:Joi.string().required()
    }
  })
  let request = {body:req.body}
  let joi_result = schema.validate(request)
  let error = joi_result.error
  if(error){
    res.status(400).send({
      success:0,
      error:error.details[0].message,
      message:"Invalid request"
    })

  }else {
    User.findOne({
    where: {
      contact: req.body.contact
    }
  })
    .then(async(user) => {
      if (!user) {
        return res.status(404).send({ 
          success:0,
          message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      const  { v4 : uuidv4 }  = require('uuid');
      let jti = uuidv4();
      console.log("jti",jti)

      let token = await jwtr.sign({ id: user.id, jti:jti }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      console.log("token",token)
       return res.status(200).send({
          id: user.id,
          name: user.name,
          contact: user.contact,
          accessToken: token
        });

      
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

  }
  
};

exports.logout = (req, res) => {
  const schema = Joi.object().keys({
    body:{
      id:Joi.number().required()
    }
  })
  let request = {body:req.body}
  let joi_result = schema.validate(request)
  let error = joi_result.error
  if(error){
    res.status(400).send({
      success:0,
      error:error.details[0].message,
      message:"Invalid request"
    })

  }else {
    User.findOne({
    where: {
      id: req.body.id
    }
  })
    .then(async(user) => {
      if (!user) {
        return res.status(404).send({ 
          success:0,
          message: "User id  Not found." });
      }

      let jti = req.query.jti
      await jwtr.destroy(jti)
       return res.status(200).send({
          success:1,
          message:"successfully logged out!"
        });
      
    })
    .catch(err => {
      res.status(500).send({success:0, message: err.message });
    });

  }

  
};