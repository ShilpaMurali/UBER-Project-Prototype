/**
 * New node file
 */

var ejs = require("ejs");
var mysql = require('./mysql');
var app = require('../app');
var session = require('client-sessions');

exports.driverSignUp=function(req, res) {

	ejs.renderFile('./views/driverSignup.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};


exports.driverSignUpForm = function(req, res){
	var newDriver= " INSERT INTO uber.Driver (`D_Firstname`, `D_Lastname`, `D_Address`, `D_City`, `D_State`, `D_ZipCode`, `D_Phone`, `D_Email`, `D_Password`) VALUES ('"+req.param("D_Firstname")+"', '" + req.param("D_Lastname") +"' , '" + req.param("D_Address") +"' , '" + req.param("D_City") +"', '" + req.param("D_State") +"' , '" + req.param("D_ZipCode") +"'  , '" + req.param("D_Phone") +"' , '" + req.param("D_Email") +"' , '" + req.param("D_Password") +"');";
		
	
	//	"INSERT INTO test.users (`emailid`, `password`, `firstname`, `lastname`, `dob`, `gender`) VALUES ('"+req.param("emailid")+"', '" + req.param("password") +"' , '" + req.param("firstname") +"' , '" + req.param("lastname") +"' , '" + req.param("dob") +"' , '" + req.param("gender") +"');";
	console.log("Query is:"+newDriver);

	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		} else {
		
			res.redirect('/');
			
		}

	},newDriver);

	};



/*

//Successful Signup Form Submission 
exports.signup = function(req, res){

var newUser= "INSERT INTO test.users (`emailid`, `password`, `firstname`, `lastname`, `dob`, `gender`) VALUES ('"+req.param("emailid")+"', '" + req.param("password") +"' , '" + req.param("firstname") +"' , '" + req.param("lastname") +"' , '" + req.param("dob") +"' , '" + req.param("gender") +"');";
console.log("Query is:"+newUser);

var newUserAbout= "INSERT INTO test.about (`emailid`) VALUES ('"+req.param("emailid")+"' );";
console.log("Query is:"+newUserAbout);

var newUserInterests= "INSERT INTO test.interests (`emailid`) VALUES ('"+req.param("emailid")+"' );";
console.log("Query is:"+newUserInterests);

mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}

	res.render("../views/successsignup.ejs", { port: '3000' }  );
	
},newUser);


mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}

	
},newUserAbout);

mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}
	
},newUserInterests);


};

*/