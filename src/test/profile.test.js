const {AuthController} = require('../controller/auth_controller')
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');


describe('AuthController.getProfile', () => {
    let authController;
    let req, res;

    beforeEach(() => {
        // Initialize AuthController
        authController = new AuthController();

        // Setup mock request object
        req = httpMocks.createRequest({
            method: 'GET',
            url: '/user/profile',
            cookies: {}  // This will be populated in individual tests if needed
        });

        // Setup mock response object
        res = httpMocks.createResponse();
        res.json = jest.fn().mockReturnValue(res);  // Chainable
        res.clearCookie = jest.fn().mockReturnThis();  // Chainable
        res.status = jest.fn().mockReturnThis();  // Chainable

        // Set environment variables if necessary
        process.env.JWT_SECRET = 'your_jwt_secret_here';
    });

    test('should respond with error if no token provided', async () => {
        const authController = new AuthController();
        const req = httpMocks.createRequest({
            cookies: {}
        });
        const res = httpMocks.createResponse();
        res.json = jest.fn().mockReturnValue(res);
    
        await authController.getProfile(req, res);
    
        expect(res.json).toHaveBeenCalledWith({ error: 'Not logged in' });
    });

    test('should clear cookie and respond with error if token is invalid', async () => {
        const authController = new AuthController();
        const req = httpMocks.createRequest({
            cookies: { token: 'invalidToken' }
        });
        const res = httpMocks.createResponse();
        res.clearCookie = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnValue(res);
    
        jwt.verify.mockImplementation((token, secret, options, callback) => {
            callback(new Error('Verification failed'), null);
        });
    
        await authController.getProfile(req, res);
    
        expect(res.clearCookie).toHaveBeenCalledWith('token');
        expect(res.json).toHaveBeenCalledWith({ error: 'Not logged in' });
    });

    test('should respond with user data if token is valid', async () => {
        const authController = new AuthController();
        const req = httpMocks.createRequest({
            cookies: { token: 'validToken' }
        });
        const res = httpMocks.createResponse();
        res.json = jest.fn().mockReturnValue(res);
    
        jwt.verify.mockImplementation((token, secret, options, callback) => {
            callback(null, { id: 'userId', userName: 'user' });
        });
    
        await authController.getProfile(req, res);
    
        expect(res.json).toHaveBeenCalledWith({ id: 'userId', userName: 'user' });
    });

})