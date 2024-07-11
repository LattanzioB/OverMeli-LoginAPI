// authController.test.js
const {AuthController} = require('../controller/auth_controller')
const {AuthService} = require('../service/auth_service');
const User = require('../model/user_model');
const httpMocks = require('node-mocks-http');

jest.mock('../service/auth_service');
jest.mock('../model/user_model');

describe('AuthController', () => {
    let authController;
    let req, res;
  
    beforeEach(() => {
      authController = new AuthController();
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    function setupResponse() {
        return httpMocks.createResponse();
      }
  
    test('should return error if userName is not provided', async () => {
      req.body = { password: 'password123' };
  
      await authController.registerUser(req, res);
  
      const data = res._getJSONData();
      expect(data).toEqual({ error: 'user name is required' });
    });
  
    test('should return error if password is not provided', async () => {
        req.body = { userName: 'user' };
        res = setupResponse();
    
        await authController.registerUser(req, res);
    
        let rawData = res._getData();
        console.log('Raw data:', rawData);
    
        try {
          let data = JSON.parse(rawData);
          expect(data).toEqual({ error: 'user password is required and at least 6 characters long' });
        } catch (error) {
          console.error('JSON Parsing Error:', error);
        }
      });
    
      test('should return error if password is less than 6 characters', async () => {
        req.body = { userName: 'user', password: '123' };
        res = setupResponse();
    
        await authController.registerUser(req, res);
    
        let rawData = res._getData();
        console.log('Raw data:', rawData);
    
        try {
          let data = JSON.parse(rawData);
          expect(data).toEqual({ error: 'user password is required and at least 6 characters long' });
        } catch (error) {
          console.error('JSON Parsing Error:', error);
        }
      });

  
    test('should return error if user already exists', async () => {
      req.body = { userName: 'user', password: 'password123' };
      User.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });
  
      await authController.registerUser(req, res);
  
      expect(res.statusCode).toBe(500);
      const data = res._getJSONData();
      expect(data).toEqual({ error: 'Email is taken already' });
    });
  
    test('should create user if data is valid', async () => {
      req.body = { userName: 'newuser', password: 'password123' };
      User.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(false),
      });
      AuthService.prototype.hashPassword.mockResolvedValue('hashedpassword');
      User.create.mockResolvedValue({ userName: 'newuser', password: 'hashedpassword' });
  
      await authController.registerUser(req, res);
  
      const data = res._getJSONData();
      expect(data).toEqual({ userName: 'newuser', password: 'hashedpassword' });
    });
  
    test('should return error if an exception occurs', async () => {
      req.body = { userName: 'newuser', password: 'password123' };
      
      User.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('some error')),
      });
  
      await authController.registerUser(req, res);
  
      expect(res.statusCode).toBe(500);
      const data = res._getJSONData();
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });