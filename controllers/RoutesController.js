var Model = require('../models/Models.js');
// Auth strategy
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


exports.Root = function(req, res){
	res.render('home', {user: req.user});
};

exports.Signin = function (req, res) {
	if(req.user === undefined)
    res.render('signin');
  else
    res.redirect('/dashboard');
};

exports.Login =  function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err)
    { 
      res.redirect("/signin");
      req.session.error = "Error while logging in.";

    }
    else if(!user)
    {
      res.redirect("/signin");
      req.session.error = "No such user.";
    }

    req.logIn(user, function(err)
    {
      if(err)
      {
        res.redirect("/signin");
        req.session.error = "Error while logging in";
      }
      else
      {
        res.redirect('/dashboard');
        req.session.success = "Welcome back!";
      }
    });
  })(req, res);
};

exports.Signup = function(req, res, next) {
    var password = req.body.password;
    var username = req.body.username;
    var name = req.body.name;
    var email = req.body.email;
    var avatar = req.body.avatar;

    var user = new Model.UserModel({
        username: username,
        password : password,
        name: name,
        email: email,
        avatar: avatar
    }).save(function (err, newUser) {
        if(err)
        {
          console.error(err);
          req.session.error = err;
          return res.redirect('/signin');
        }
        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
      });
};

exports.Logout = function(req, res){
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out!";
};


// Used to check if user is logged in in some routes
function loggedIn(req, res, next) {
  if(req.user) {
    next();
  }
  else {
    res.redirect('/signin');
    req.session.notice = "You must be logged in to see this page.";
  }
}


// Passport Local Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if(err)
        return done(err);
      if (!user)
        return done(null, false, { message: 'Incorrect username.' });
      if (user.password !== password)
        return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    });
  }
));