const mongoose = require('mongoose');
const UserModel = require('./model/user_model'); 
const bcrypt = require('bcrypt');

async function setupDatabase() {
  const hashedPassword = await bcrypt.hash('123456', 12); 
  try {
    const adminExists = await UserModel.findOne({ userName: 'admin' });
    if (!adminExists) {
      await UserModel.create({
        userName: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created');
    }
    const userExists1 = await UserModel.findOne({ userName: 'user1' });
    if (!userExists1) {
      await UserModel.create({
        userName: 'user1',
        password: hashedPassword,
        role: 'user',
      });
      console.log('User created');
    }
    const userExists2 = await UserModel.findOne({ userName: 'user2' });
    if (!userExists2) {
      await UserModel.create({
        userName: 'user2',
        password: hashedPassword,
        role: 'user',
      });
      console.log('User created');
    }
    const userExists3 = await UserModel.findOne({ userName: 'user3' });
    if (!userExists3) {
      await UserModel.create({
        userName: 'user3',
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