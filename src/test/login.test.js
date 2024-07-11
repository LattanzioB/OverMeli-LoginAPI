const {AuthController} = require('../controller/auth_controller')
const {AuthService} = require('../service/auth_service');
const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

jest.mock('../service/auth_service');
jest.mock('../model/user_model');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let authController;
    let req, res;

    beforeEach(() => {
        authController = new AuthController();
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        res.cookie = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
    
        // Setup User.findOne to return an object with an exec method
        User.findOne = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null) // Adjust the mockResolvedValue as necessary for each test
        });
    });

    test('should return error if no user found', async () => {
        req.body = { userName: 'testuser', password: 'testpass' };
        
        // Mock User.findOne to return null for this test scenario
        User.findOne().exec.mockResolvedValue(null);
    
        await authController.loginUser(req, res);
    
        expect(res.json).toHaveBeenCalledWith({
            error: 'No user found'
        });
    });

    test('should return error if password is invalid', async () => {
        req.body = { userName: 'testuser', password: 'testpass' };
        User.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                userName: 'testuser',
                password: 'hashedpassword'
            })
        });
        AuthService.prototype.comparePassword.mockResolvedValue(false);

        await authController.loginUser(req, res);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid password'
        });
    });

    test('should login user and return token if credentials are valid', async () => {
        req.body = { userName: 'testuser', password: 'testpass' };
        User.findOne().exec.mockResolvedValue({
            userName: 'existingUser',
            password: 'hashedPassword',
            _id: 'someUserId'
        });
        AuthService.prototype.comparePassword.mockResolvedValue(true);
        jwt.sign.mockImplementation((payload, secret, options, callback) => {
            callback(null, 'fakeToken');
        });

        await authController.loginUser(req, res);

        expect(res.cookie).toHaveBeenCalledWith('token', 'fakeToken');
        expect(res.json).toHaveBeenCalledWith(expect.any(Object)); // Modify according to actual user object
    });

    test('should handle errors and return status 500', async () => {
        req.body = { userName: 'testuser', password: 'testpass' };
        User.findOne().exec.mockRejectedValue(new Error('Database error'));

        await authController.loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});