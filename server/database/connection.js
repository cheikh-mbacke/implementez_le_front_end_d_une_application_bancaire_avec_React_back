const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

async function dbConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // Synchronisez tous vos modèles ici si nécessaire
    await sequelize.sync(); // À décommenter si vous voulez que Sequelize gère la création de la structure de la BDD
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = dbConnection;
