var RoutesController = require('./controllers/RoutesController');

// Routes
module.exports = function(app){
	app.get('/',RoutesController.Root);
	app.get('/signin',RoutesController.Signin);
	app.get('/login',RoutesController.Login); 
	app.post('/signup',RoutesController.Signup); 
	app.get('/logout',RoutesController.Logout); 
}