const {auth, signUp } = require("../middleware");
const auth_controller = require("../controllers/auth_controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/signup",[signUp.checkDuplicateContact],auth_controller.signup);
  app.post("/signin", auth_controller.signin);
  app.post("/logout",[auth.verifyToken],auth_controller.logout)

};
