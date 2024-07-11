const {AuthController} = require('../controller/auth_controller')
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

    test('should return error if user name is not provided', async () => {
        const authController = new AuthController();
        const req = httpMocks.createRequest({
            body: {}
        });
        const res = httpMocks.createResponse();
        res.json = jest.fn().mockReturnValue(res);
    
        await authController.deleteUser(req, res);
    
        expect(res.json).toHaveBeenCalledWith({
            error: 'user name is required'
        });
    });

    test('should return error if user does not exist', async () => {
        const authController = new AuthController();
        const req = httpMocks.createRequest({
            body: { userName: 'nonexistent' }
        });
        const res = httpMocks.createResponse();
        res.json = jest.fn().mockReturnValue(res);
    
        User.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
    
        await authController.deleteUser(req, res);
    
        expect(res.json).toHaveBeenCalledWith({
            error: 'User doesnt exist'
        });
    });

    test('should delete user successfully', async () => {
        const authController = new AuthController();
        const req = httpMocks.createRequest({
            body: { userName: 'existingUser' }
        });
        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
    
        User.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue({ userName: 'existingUser' })
        });
        User.deleteOne.mockResolvedValue({});
    
        await authController.deleteUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: 'User Deleted' });
    });

    test('should handle errors during deletion process', async () => {
        const authController = new AuthController();
        const req = httpMocks.createRequest({
            body: { userName: 'existingUser' }
        });
        const res = httpMocks.createResponse();
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
    
        User.findOne.mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database failure'))
        });
    
        await authController.deleteUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
})