const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../model/models');
const User = models.User;
const errors = require('./errors').errors;
const roles = require('../config/roles');

function register(username, email, password){
    const hashedPassword = bcrypt.hashSync(password, 8);

    return new Promise((resolve, reject) =>
        User.create({
            username: username,
            email: email,
            password: hashedPassword
        }, function(err, user){
            if (err){
                console.log(err);
                reject(errors[202].errorMessage());
            }
            resolve(user);
        })
    );
}

function login(email, password){
    return new Promise((resolve, reject) =>
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

            resolve(
                jwt.sign({
                    id: user._id ,
                    role: user.role,
                    username: user.username,
                    email: user.email
                }, global.gConfig.secret, {
                    expiresIn: 86400 // expires in 24 hours
                })
            );
        })
    );
}

function ensureAuthenticated(token, requestedRessource){
    return new Promise((resolve, reject) =>{
        jwt.verify(token, global.gConfig.secret, function(err, decoded){
            if (err) {
                reject(err);
            }
            const allowedRessources = roles[decoded.role];
            let reg;
            for(let ressource of allowedRessources){
                console.log('ok');
                reg = new RegExp(ressource);
                if (reg.test(requestedRessource)){
                    resolve(true);
                }
            }
            reject(errors[402].errorMessage());
        });

    });
}

module.exports = {
    register,
    login,
    ensureAuthenticated
};