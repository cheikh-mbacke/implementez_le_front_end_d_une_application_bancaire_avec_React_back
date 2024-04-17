const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db"); 

class User extends Model {}

User.init(
  {
    // Définition des champs avec les types
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true, // Génère automatiquement les champs createdAt et updatedAt
    hooks: {
      // Hooks pour transformer les données (similaire à toObject de Mongoose)
      afterFind: (users) => {
        if (Array.isArray(users)) {
          users = users.map((user) => user.get({ plain: true }));
        } else if (users) {
          users = users.get({ plain: true });
        }
        if (users) {
          if (Array.isArray(users)) {
            users.forEach((user) => {
              user.id = user.id.toString();
            });
          } else {
            users.id = users.id.toString();
          }
        }
        return users;
      },
    },
  }
);

module.exports = User;
