// seed.js
const bcrypt = require("bcrypt");
const User = require("./models/userModel");

async function seedUsers() {
  try {
    await User.sync({ force: true }); // Utilisez force: true avec prudence

    const usersData = [
      {
        userName: "Tony",
        firstName: "Tony",
        lastName: "Stark",
        email: "tony@stark.com",
        password: "password123",
      },
      {
        userName: "Steve",
        firstName: "Steve",
        lastName: "Rogers",
        email: "steve@rogers.com",
        password: "password456",
      },
    ];

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
      });
    }
  } catch (error) {
    console.error("Failed to seed users:", error);
  }
}

module.exports = seedUsers;
