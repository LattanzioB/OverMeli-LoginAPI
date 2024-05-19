const {registerUser, loginUser, getProfile} = require('../controller/auth_controller')
const {mongoose} = require('mongoose');
const User = require('../model/user_model');
const {url} = require('../config.js')


describe('insert', () => {
  beforeAll(async () => {
    //database connection
    console.log("Test Data base conected")
    mongoose.connect(url) //Web: process.env.MONGO_URL //docker: url
    .then(()=> console.log('Test Database Connected'))
    .catch((err) => console.log('Test Database not Connected', err))
    
  });

  beforeEach(async () => {
    await User.deleteMany({}); // Clear the collection before each test
  });

  afterAll(async () => {
    mongoose.deleteModel('User')
  });

  it('should insert a user into collection', async () => {

    const mockUser = {userName: 'user1', password: 'a12345'};
    const user = await User.create(mockUser)
    expect(user).toBeDefined();
    expect(user.userName).toBe(mockUser.userName);
  });

  it('should insert and retrive a user into collection', async () => {

    const mockUser = {userName: 'user2', password: 'a12345'};
    await User.create(mockUser)

    const insertedUser = await User.findOne({userName: mockUser.userName}).exec();
    expect(insertedUser).toBeDefined();
    expect(insertedUser.userName).toBe(mockUser.userName);
    expect(insertedUser).toHaveProperty('_id')
  });
});
/*
test('register user successfuly', async () => {
    await expect(registerUser({ userName:'user1', password:'password' }).resolves.toHaveProperty(userName, 'user1') );
  });
  */