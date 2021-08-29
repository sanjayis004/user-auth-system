const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors(corsOptions));
const db = require("./app/models");
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


require('./app/routes/auth_route')(app);
require('./app/routes/user_route')(app);


var corsOptions = {
  origin: "http://localhost:8081"
};

db.sequelize.sync({force: false}).then(() => {
  console.log('Drop and Resync Db');
 
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to auth system " });
});

// set port, listen for requests
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});