const bcrypt = require('bcrypt');
const {AuthService} = require('../service/auth_service');



jest.mock('bcrypt', () => ({
    genSalt: jest.fn((saltRounds, callback) => callback(null, 'testSalt')),
    hash: jest.fn((data, salt, callback) => callback(null, 'hashedPassword')),
    compare: jest.fn((data, encrypted) => Promise.resolve(true)) // Mock as a promise
}));


describe('AuthService', () => {
    let authService;

    beforeEach(() => {
        authService = new AuthService();
    });

    test('hashPassword should resolve with a hash', async () => {
        const password = 'testPassword';
        await expect(authService.hashPassword(password)).resolves.toEqual('hashedPassword');
        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 'testSalt', expect.any(Function));
    });

    test('hashPassword should reject on error', async () => {
        bcrypt.genSalt.mockImplementationOnce((saltRounds, callback) => callback(new Error('Salt generation failed')));
        await expect(authService.hashPassword('password')).rejects.toThrow('Salt generation failed');
    });

    test('comparePassword should throw an error if password or hashed is missing', () => {
        expect(() => authService.comparePassword(undefined, 'hashed')).toThrow('Both password and hashed arguments are required.');
        expect(() => authService.comparePassword('password', undefined)).toThrow('Both password and hashed arguments are required.');
    });
    
    test('comparePassword should resolve true if passwords match', async () => {
        const password = 'password';
        const hashed = 'hashedPassword';
        await expect(authService.comparePassword(password, hashed)).resolves.toBe(true);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hashed);
    });
    
    test('comparePassword should resolve false if passwords do not match', async () => {
        bcrypt.compare.mockImplementationOnce((data, encrypted) => Promise.resolve(false));
        await expect(authService.comparePassword('password', 'differentHashed')).resolves.toBe(false);
    });
});

