module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    name: {
      type: Sequelize.STRING
    },
    contact: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};