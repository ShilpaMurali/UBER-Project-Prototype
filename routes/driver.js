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
		
	
	
	console.log("Query is:"+newDriver);

	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		} else {
		
			res.redirect('/');
			
		}

	},newDriver);

	};


	//Loading Existing Rides  for the Driver
	exports.driverHistory = function(req,res){
			console.log("I will load History page");
			res.render('driverRidesHistory');
	
	}
	
	
	//Driver Billing and Ride History
	
	exports.driverRideHistory = function(req, res){
	var driverBillHistory =  " select * from UBER.Ride_History natural join UBER.Driver natural join UBER.Customer where Driver_ID = '15'; ";
		
		console.log("Query is:"+driverBillHistory);

		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			} else {
			
				console.log("sending result back to polls controller");
				console.log(results);
				res.send(results);
				//res.render('driverRidesHistory');	
				//res.redirect('/driver/RidesHistory');
				//res.send(results);
			}

		},driverBillHistory);

		};

	
		//Opening individual Ride Details

		exports.rideDetailsLoad = function(req,res){
		
			var Ride_ID = req.body.Ride_ID;
			
			console.log("and the Ride id is: "+Ride_ID);
			
			console.log("Loading Ride Details page");
			
		
		}	
		
		
		
		
		// Load Ride Details
		exports.rideDetails = function(req, res){
			
			var Ride_ID = req.body.Ride_ID;
			console.log( "and the Ride id is: "+Ride_ID);       
			
			var existingRideDetails = " select * from UBER.Ride_History natural join UBER.Driver natural join UBER.Customer where Ride_ID = '"+Ride_ID+"'; ";
			
			mysql.fetchData(function(err,result){
				if(err){
					console.log("error occured");
				}
				else{
					console.log("sending result back to ride controller");
					console.log(result);
					
					res.send(result);
				}
			},existingRideDetails);
		}			
		
		// Delete Ride Details
		exports.rideDelete = function(req, res){
			
			var Ride_ID = req.body.Ride_ID;
			console.log( "and the Ride id is: "+Ride_ID);       
			
			var existingRideDelete = " DELETE FROM `UBER`.`Ride_History` WHERE `Ride_ID`='"+Ride_ID+"'; ";
				
			//	" select * from UBER.Ride_History natural join UBER.Driver natural join UBER.Customer where Ride_ID = '"+Ride_ID+"'; ";
			
			mysql.fetchData(function(err,result){
				if(err){
					console.log("error occured");
				}
				else{
					console.log("sending result back to ride controller");
					console.log(result);
					
					
				}
			},existingRideDelete);
		}			
				
		
		
		
		
	
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