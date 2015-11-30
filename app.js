
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , signUpIn = require('./routes/signUpIn')//frontpage,signin,signup
  , driver = require('./routes/driver')
  , http = require('http')
  , path = require('path')
  , selectDriver = require('./routes/selectDriver')
  , adminSignIn = require('./routes/adminSignIn')
  , driverSignIn = require('./routes/driverSignIn');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// MONGO

var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

//Mongo Sessions:
app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
/* Front, Signup,Signin pages*/
app.get('/homepage/signIn', signUpIn.signIn);
app.get('/homepage/signUp', signUpIn.signUp);
app.get('/homepage/signin/customer', signUpIn.customerSignIn);
app.get('/homepage/signin/driver', signUpIn.driverSignIn);
app.get('/homepage/signin/admin', signUpIn.adminSignIn);
//Driver,Customer Signup page
app.get('/homepage/signup/driver', driver.driverSignUp);
app.get('/homepage/signup/customer', signUpIn.customerSignUp);

//Driver Signup form
app.post('/homepage/signup/driver/submit', driver.driverSignUpForm);

// Admin
app.post('/adminSignIn', adminSignIn.adminSignIn);

// Driver SignIn
app.post('/homepage/signin/driver/login/',driverSignIn.login);
app.get('/driver/RidesHistory',driver.driverRideHistory);
app.get('/driver/RidesHistoryLoad',driver.driverHistory);


//partials
app.get('/partials/:filename',routes.partials);
app.get('/partials/driverProfile/:drivername',routes.partials);
app.post('/selectDriver',selectDriver.selectDriver);


//connect
//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});
