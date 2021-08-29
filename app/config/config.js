module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "root",
  DB: "testdb",
  dialect: "mysql",
  secret: "the-secret-key-enigma",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};