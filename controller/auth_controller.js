const User = require('../model/user_model');
const {AuthService} = require('../service/auth_service');
const jwt = require('jsonwebtoken');


class AuthController {
    constructor(){
        this.auth_service = new AuthService()
    }

    async registerUser(req, res){
        try{
            const {userName, password} = req.body;
            // Check if name was entered
            if(!userName){
                return res.json({
                    error: 'user name is required'
                })
            };
            // Check if password was entered
            if(!password | password.length < 6){
                return res.json({
                    error: 'user password is required and at least 6 characters long'
                })    
            }
            console.log(userName)
            const exist = await User.findOne({userName}).exec()
            if(exist) {
                return res.json({
                    error: 'Email is taken already'
                })
            }
            const hashedPassword = await this.auth_service.hashPassword(password)
            const user = await User.create({
                userName, password: hashedPassword
            })
    
            return res.json(user)
    
        } catch (error){
            console.log(error)
        }
    }

    async loginUser(req,res){
        try {
            console.log(req.body)
            const {userName, password} = req.body;
            
            //Check if user exist
            const userExist = await User.findOne({userName}).exec();
            if(!userExist){
                return res.json({
                    error: 'No user found'
                })
            }
            const match = await this.auth_service.comparePassword(password, userExist.password)
            if(match){
                jwt.sign({userName: userExist.userName, id: userExist._id}, process.env.JWT_SECRET, {}, (err, token) =>{
                    if(err) throw err;
                    res.cookie('token', token).json(userExist)
                })
            }
            else{
                res.json({
                    error: 'Invalid password'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    async getProfile(req, res) {
        const {token} = req.cookies
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, {}, (err, user)=>{
                if(err){throw err};
                res.json(user);
            })
        }
        else{
            res.json({error: 'No valid jwt'})
        }
    }
}





module.exports = {
    AuthController
}