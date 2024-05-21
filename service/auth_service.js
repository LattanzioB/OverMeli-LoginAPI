const bcrypt = require('bcrypt');

class AuthService{
    hashPassword(password){
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(12, (err, salt) => {
                if(err) {
                    reject(err)
                }
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err){
                        reject(err)
                    }
                    resolve(hash)
                })
            })
        })
    }

    comparePassword(password, hashed){
        // Check if either password or hashed is undefined or null
        if (!password || !hashed) {
            console.log(password)
            console.log(hashed)
            // Handle the case where either argument is missing
            throw new Error('Both password and hashed arguments are required.');
        }
    
        // Both password and hashed are provided, proceed with comparison
        return bcrypt.compare(password, hashed);
    }
}


module.exports = {
    AuthService
}