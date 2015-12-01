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
			
				console.log("sending result back to the controller");
				console.log(results);
				res.send(results);

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
				
		
		
		
		
	
	