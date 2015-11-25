
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  //, signUpIn = require('./routes/signUpIn')//frontpage,signin,signup
  , driver = require('./routes/driver')
  , http = require('http')
  , path = require('path');

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



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
/* Front, Signup,Signin pages*/
//app.get('/signIn', signUpIn.signIn);
//app.get('/signUp', signUpIn.signUp);
/*app.get('/customerSignIn', signUpIn.customerSignIn);
app.get('/driverSignIn', signUpIn.driverSignIn);
app.get('/customerSignUp', signUpIn.customerSignUp);
*/

//Driver Signup page
app.get('/signup/driver', driver.driverSignUp);

//Driver Signup form
app.get('/signup/driver/submit', driver.driverSignUpForm);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
