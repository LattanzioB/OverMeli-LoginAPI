const express = require('express');

const cors = require('cors');
const {AuthController} = require('../controller/auth_controller')
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *           description: The user name
 *         password:
 *           type: string
 *           description: The password
 *       example:
 *         userName: user1
 *         password: a2c4e6
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The loged User.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

//middleware
class AuthRouter {
    constructor(){
        this.auth_router = express.Router();
        this.auth_controller = new AuthController();
        this.auth_router.use(
            cors({
                credentials: true,
                origin: 'http://localhost:8090'
            })
        )
        this.auth_router.post('/register', this.auth_controller.registerUser)
        this.auth_router.post('/login', this.auth_controller.loginUser)
        this.auth_router.get('/profile', this.auth_controller.getProfile)
    }

    get_routes() {
        return this.auth_router
    }
}





module.exports = {AuthRouter}