var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code4Share - a platform for code sharing.' });
});

router.get('/about', function(req, res, next){
  res.render('about', { title: 'Code4Share - a platform for code sharing.' })
});

router.route('/contact')
  .get(function(req, res, next){
    res.render('contact', { title: 'Code4Share - a platform for code sharing.' } )
  })
  .post(function(req, res, next){
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('message', 'Empty Message').notEmpty();
    var errors = req.validationErrors();

    if(errors){
      res.render('contact', {
      title: 'Code4Share - a platform for code sharing.',
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      errorMessages: errors
    })
    }
    else
    {
      var mailOptions = {
        from: 'Code4Share <no-reply@code4share.com>',
        to: 'anandaditya444@gmail.com',
        subject: 'You got a new message from Code4Share 😀',
        text: req.body.message
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error)
        {
          return console.log(error);  
        }
        res.render('thank' , { title: 'Code4Share - a platform for code sharing.' });
      });
    }
  });

module.exports = router;
