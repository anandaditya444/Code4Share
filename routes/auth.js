var express = require('express');
var router = express.Router();
var passport = require('passport');

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);  


router.route('/login')
    .get(function(req, res, next){
        res.render('login',{ title: 'Login into your account' })
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect('/');
    });

  router.route('/register')
    .get(function(req, res, next){
    res.render('register',{ title: 'Register new account' })
    })
    .post(function(req, res, next){
        req.checkBody('name', 'Empty Name').notEmpty();
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'Empty Password').notEmpty();
        req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

        var errors = req.validationErrors();
        if(errors){
            res.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors   
            });
        }else {
            
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            user.save(function(err) {
                if(err) {
                    res.render('register', {errorMessages: err});
                }else {
                    var mailOptions = {
                        from: 'Code4Share <no-reply@code4share.com>',
                        to: req.body.email,
                        subject: 'You got a new message from Code4Share 😀',
                        text: 'You are successfully registered.'
                      };
                
                      transporter.sendMail(mailOptions, function(err, info){
                        if(err)
                        {
                          return console.log(err);  
                        }
                        res.redirect('/login');
                      });
                    
                }
            })
        }
    })

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
}));

module.exports = router;