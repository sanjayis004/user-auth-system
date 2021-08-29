module.exports = {
  HOST: "db4free.net",
  USER: "sanjay12345678",
  PASSWORD: "sanjay12345678",
  DB: "sanjaydb12345678",
  dialect: "mysql",
  secret: "the-secret-key-enigma",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};