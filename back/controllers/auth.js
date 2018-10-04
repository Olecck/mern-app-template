const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/models').User;
const errors = require('./errors').errors;
const roles = require('../config/roles');

function register(username, email, password){
    return new Promise(function(resolve, reject){

        const hashedPassword = bcrypt.hashSync(password, 8);

        User.create({
            username: username,
            email: email,
            password: hashedPassword
        }, function(err, user){
            if (err){
                reject(errors[202]);
            }
            resolve(user.id);
        });
    });
}

function ensureAuthenticated(email, password, requestedRessource){
    return new Promise(function(resolve, reject){
        User.findOne({email: email}, function(err, user) {
            if (err) {
                reject(errors[201]); // db error
            } if (!user) {
                reject(errors[301]); // user not found
            }

            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid){
                reject(errors[401]) // wrong password
            }

            // user is found, password is valid, we just need to check if the ressource is allowed.

            const allowedRessources = Object.keys(roles[user.role]);
            for(let ressource of allowedRessources){
                if (ressource.test(requestedRessource)){
                    const token = jwt.sign({ id: user._id }, global.gConfig.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    resolve(token); // send token
                }
            }
            reject(errors[402]); //not allowed to see this ressource
        });
    });
}

module.exports = {
    register,
    ensureAuthenticated
};