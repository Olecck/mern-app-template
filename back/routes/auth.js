const express = require('express');
const router = express.Router();
const authUtils = require('../controllers/auth');

router.post('/login', function(req, res){
    authUtils.login(req.body.email, req.body.password, '/auth/login').then(
        (token) => res.send({
            status: "success",
            token: token
        }),
        err => res.send(err)
    );
});

router.post('/register', function(req, res){
    authUtils.register(req.body.username, req.body.email, req.body.password).then(
        user => res.send({
            status: "success",
            data: user
        }),
        err => res.send(err)
    );
});

router.post('/confirm', function(req, res){
    authUtils.ensureAuthenticated(req.headers.authorization, "/auth/confirm").then(
        ok => res.send({
            status: "success",
            data: ok
        }),
        err => res.send({
            status: "error",
            data: err
        })
    )
});

module.exports = router;