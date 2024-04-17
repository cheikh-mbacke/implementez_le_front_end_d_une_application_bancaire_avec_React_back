const User = require("../database/models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (serviceData) => {
  try {
    const user = await User.findOne({ where: { email: serviceData.email } });
    if (user) {
      throw new Error("Email already exists");
    }

    const hashPassword = await bcrypt.hash(serviceData.password, 12);

    const newUser = await User.create({
      email: serviceData.email,
      password: hashPassword,
      userName: serviceData.userName,
      firstName: serviceData.firstName,
      lastName: serviceData.lastName,
    });

    return newUser;
  } catch (error) {
    console.error("Error in userService.js", error);
    throw error;
  }
};

exports.getUserProfile = async (serviceData) => {
  try {
    const jwtToken = serviceData.headers.authorization
      .split("Bearer ")[1]
      .trim();
    const decodedJwtToken = jwt.decode(jwtToken);

    const user = await User.findByPk(decodedJwtToken.id);
    if (!user) {
      throw new Error("User not found!");
    }
    return user;
  } catch (error) {
    console.error("Error in userService.js", error);
    throw error;
  }
};

exports.loginUser = async (serviceData) => {
  try {
    const user = await User.findOne({
      where: { email: serviceData.email },
      attributes: { include: ["password"] },
    });
    if (!user) {
      throw new Error("User not found!");
    }

    const isValid = await bcrypt.compare(serviceData.password, user.password);
    if (!isValid) {
      throw new Error("Password is invalid");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY || "default-secret-key",
      { expiresIn: "1d" }
    );

    return { token };
  } catch (error) {
    console.error("Error in userService.js", error);
    throw error;
  }
};

exports.updateUserProfile = async (serviceData) => {
  try {
    const jwtToken = serviceData.headers.authorization
      .split("Bearer ")[1]
      .trim();
    const decodedJwtToken = jwt.decode(jwtToken);

    const updatedUser = {
      userName: serviceData.body.userName,
      firstName: serviceData.body.firstName,
      lastName: serviceData.body.lastName,
    };

    const user = await User.update(updatedUser, {
      where: { id: decodedJwtToken.id },
      returning: true,
    });

    if (!user) {
      throw new Error("User not found!");
    }

    return updatedUser; // Sequelize retourne un tableau [affectedCount, affectedRows]
  } catch (error) {
    console.error("Error in userService.js", error);
    throw error;
  }
};
