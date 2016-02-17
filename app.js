var MONGO_USER = "example";
var MONGO_PASS = "example";

var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var app = express();


// create application/json parser 
var jsonParser = bodyParser.json()
 // create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// Configure express to use handlebars templates
var hbs = exphbs.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Mongo DB connection
var mongoose = require('mongoose');
mongoose.connect("mongodb://"+MONGO_USER+":"+MONGO_PASS+"@ds011268.mongolab.com:11268/letsgoout");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, index: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    avatar: {type: String, default: "http://www.qatarliving.com/sites/all/themes/qatarliving_v3/images/avatar.jpeg"},
    created: { type: Date, default: Date.now },
});
var User = mongoose.model('users', UserSchema);

// Auth strategy
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

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

// App configuration
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

// Send messages to view
app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.notice;
  var success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if(err)
    res.locals.error = err;
  if(msg) 
    res.locals.notice = msg;
  if(success) 
    res.locals.success = success;

  next();
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Routes 
app.get('/', function (req, res) {
  res.render('home', {user: req.user});
});

app.get('/signin', function (req, res) {
  if(req.user === undefined)
    res.render('signin');
  else
    res.redirect('/dashboard');
});

// Logs user in
app.post('/login', function(req, res) {
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
});

// Signs up user to system and logs him in inmediatly
app.post('/signup', urlencodedParser, function(req, res, next) {
    var password = req.body.password;
    var username = req.body.username;
    var email = req.body.email;
    var avatar = req.body.avatar;

    var user = new User({
        username: username,
        password : password,
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
          res.redirect('/dashboard');
        });
      });
});

// Logs out from session
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out!";
});

app.listen(process.env.PORT || 5000);

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
