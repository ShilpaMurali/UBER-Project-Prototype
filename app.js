
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , admin = require ('./routes/admin')
  , user = require('./routes/user')
  , signUpIn = require('./routes/signUpIn')//frontpage,signin,signup
  , driver = require('./routes/driver')
  , driverhpp = require('./routes/driverHPP')
  , customer = require('./routes/customer')
  , customerhpp = require('./routes/customerHPP')
  , http = require('http')
  , path = require('path')
  , selectDriver = require('./routes/selectDriver')
  , adminSignIn = require('./routes/adminSignIn')
  , adminRoutes = require('./routes/adminRoutes')
  , customerSignIn = require('./routes/customerSignIn')
  ,bodyParser=require('body-parser')
  ,rideDetails=require('./routes/rideDetails')
  , driverSignIn = require('./routes/driverSignIn');

var app = express();


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
//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.use(express.favicon());

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


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
// Customer Ride History
app.get('/customer/RidesHistory',customer.customerRideHistory);
app.get('/customer/RidesHistoryLoad',customer.customerHistory);



app.get('/homepage/signin/driver', signUpIn.driverSignIn);
app.get('/homepage/signin/admin', signUpIn.adminSignIn);
//Driver,Customer Signup page
app.get('/homepage/signup/driver', driver.driverSignUp);
app.get('/homepage/signup/customer', signUpIn.customerSignUp);

//Driver Signup form
app.post('/homepage/signup/driver/submit', driver.driverSignUpForm);

//Customer Signup form
app.post('/homepage/signup/customer/submit', customer.customerSignUpForm);

// Admin
//app.post('/adminSignIn', adminSignIn.adminSignIn);
app.post('/homepage/signin/login', adminSignIn.adminSignIn);

app.get('/admCustomerList', adminRoutes.admCustomerList);
app.get('/admDriverList', adminRoutes.admDriverList);
app.get('/admSearchBill', adminRoutes.admSearchBill);
app.get('/searchBillFunc', adminRoutes.searchBillFunc);
app.get('/admReviewDriver', adminRoutes.admReviewDriver);
app.get('/searchDriverFunc', adminRoutes.searchDriverFunc);
app.get('/admReviewCustomer', adminRoutes.admReviewCustomer);
app.get('/searchCustomerFunc', adminRoutes.searchCustomerFunc);
app.get('/admRevenuePDay', adminRoutes.admRevenuePDay);
app.get('/dayRevenueFunc', adminRoutes.dayRevenueFunc);
app.get('/admRevenuePLoc', adminRoutes.admRevenuePLoc);
app.get('/locRevenueFunc', adminRoutes.locRevenueFunc);
app.get('/admGraphs', adminRoutes.admGraphPg);
app.get('/admGraphBack', adminRoutes.admGraphBack);
app.get('/adminLogout',adminRoutes.adminLogout);

//********************** ADMIN GRAPHS ********************** //
app.get('/getRidesPerArea',admin.renderRidesPerAreaGraph);
app.get('/getRidesPerAreaStatistics',admin.getRidesPerAreaStatistics);

app.get('/getRevenuePerLocation',admin.renderRevenuePerAreaGraph);
app.get('/getRevenuePerAreaStatistics',admin.getRevenuePerAreaStatistics);

app.get('/getRevenuePerDay',admin.renderRevenuePerDayGraph);
app.post('/getRevenuePerDayStatistics',admin.getRevenuePerDayStatistics);

app.get('/getRidesPerDriver',admin.renderRidesPerDriverGraph);
app.get('/getRidesPerDriverStatistics',admin.getRidesPerDriverStatistics);

app.get('/getRidesPerCustomer',admin.renderRidesPerCustomerGraph);
app.get('/getRidesPerCustomerStatistics',admin.getRidesPerCustomerStatistics);


// Driver SignIn
app.post('/homepage/signin/driver/login/',driverSignIn.login);
// Customer SignIn
app.post('/homepage/signin/customer/login/',customerSignIn.login);

//Maps - Customer Homepage
app.get('/homepage/signin/customer/homepage',customerSignIn.rendermaps);

//Driver Homepage
app.get('/homepage/signin/driver/homepage',driverSignIn.renderHomepage);
app.get('/getDriverHomePageDetails',driverhpp.getDriverHomePageDetails);

//ViewCustomerProfile
app.get('/customer/viewProfile',customerhpp.renderViewProfile);
app.get('/customer/getProfilePageDetails',customerhpp.getProfileDetails);

//ViewDriverProfile
app.get('/driver/viewProfile',driverhpp.renderViewProfile);
app.get('/driver/getProfilePageDetails',driverhpp.getProfileDetails);


//EditCustomerProfile
app.get('/customer/editProfile',customerhpp.renderEditProfilePage);
app.post('/customer/updateProfile',customerhpp.updateCustomerProfile);

//EditDriverProfile
app.get('/driver/editProfile',driverhpp.renderEditProfilePage);
app.post('/driver/updateProfile',driverhpp.updateDriverProfile);

app.get('/driver/RidesHistory',driver.driverRideHistory);
app.get('/driver/RidesHistoryLoad',driver.driverHistory);


//Opening individual Rides for driver
app.post('/rideDetails', driver.rideDetails);

//Opening individual Polls for customer
app.post('/rideDelete', driver.rideDelete);


//partials
app.get('/partials/:filename',routes.partials);
//app.get('/partials/driverProfile/:drivername',routes.partials);
app.post('/selectDriver',selectDriver.selectDriver);

app.post('/insertRide',rideDetails.insertRide);
app.post('/cancelRide',rideDetails.cancelRide);
app.post('/updateRide',rideDetails.updateRide);

//Logout
app.get('/logout',customerSignIn.logout);

//DeleteAccount
app.get('/deleteAccount',customerSignIn.deleteAccount);

//connect
//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});
