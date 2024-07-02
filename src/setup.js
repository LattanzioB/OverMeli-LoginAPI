const mongoose = require('mongoose');
const UserModel = require('./model/user_model'); 
const bcrypt = require('bcrypt');

async function setupDatabase() {
  try {
    const adminExists = await UserModel.findOne({ userName: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 12); 
      await UserModel.create({
        userName: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created');
    }

    const userExists = await UserModel.findOne({ userName: 'user' });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('123456', 12); 
      await UserModel.create({
        userName: 'user',
        password: hashedPassword,
        role: 'user',
      });
      console.log('User created');
    }
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

module.exports = setupDatabase;