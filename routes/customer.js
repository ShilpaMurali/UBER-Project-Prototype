/*
var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit:100,
	host:'localhost',
	user: 'root',
	password: 'root',
	database: 'UBER',
	debug: false
});

*/

var ejs = require("ejs");
var mysql = require('./mysql');
var app = require('../app');
//var session = require('client-sessions');

exports.customerSignUpForm = function(req, res){
	var newCustomer= " INSERT INTO uber.Customer (`C_Firstname`, `C_Lastname`, `C_Address`, `C_City`, `C_State`, `C_ZipCode`, `C_Phone`, `C_Email`, `C_Password`) VALUES ('"+req.param("C_Firstname")+"', '" + req.param("C_Lastname") +"' , '" + req.param("C_Address") +"' , '" + req.param("C_City") +"', '" + req.param("C_State") +"' , '" + req.param("C_ZipCode") +"'  , '" + req.param("C_Phone") +"' , '" + req.param("C_Email") +"' , '" + req.param("C_Password") +"');";
		
	
	
	console.log("Query is:"+newCustomer);

	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		} else {
		
			res.redirect('/');
			
		}

	},newCustomer);

	};



exports.renderEditProfilePage = function (req,res) {
	res.render("EditCustomerProfile");
};

exports.renderCustomerProfilePage = function (req,res) {
	res.render("ViewCustomerProfile");
};

exports.getProfileDetails = function (req,res) {
	//req.session.customerID = 1;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select * from customer where Customer_ID = ?",[1/*req.session.customerID*/],function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	var json_responses = {"statusCode" : 200,
        			"firstname" : rows[0].C_Firstname,
        			"lastname" : rows[0].C_Lastname,
        			"address" : rows[0].C_Address,
        			"city" : rows[0].C_City,
        			"state" : rows[0].C_State,
        			"zipcode" : rows[0].C_ZipCode,
        			"contact": rows[0].C_Phone,
        			"email": rows[0].C_Email,
        			"cardnumber" : rows[0].C_Credit_Card_No,
        			"cardcvv" : rows[0].C_Credit_Card_CVV,
        			"cardexpiry" : rows[0].C_Credit_Card_EXP,
        			"cardzip" : rows[0].C_Credit_Card_ZIP,
        			"password" : rows[0].C_Password,
        			"rating": rows[0].C_Avg_Rating,
        	};
			res.send(json_responses);
        });
	});
};

exports.updateCustomerProfile = function (req,res) {
	//req.session.customerid = 1;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        } 

        connection.query("update customer set C_Firstname=?,C_Lastname=?,C_Address=?,C_City=?,C_State=?,C_ZipCode=?,C_Phone=?," +
        		"C_Email=?,C_Credit_Card_No=?,C_Credit_Card_CVV=?,C_Credit_Card_EXP=?,C_Credit_Card_ZIP=?,C_Password=?" +
        		"where Customer_ID = ?",
        		[req.param("FirstName"),req.param("LastName"),req.param("Address"),req.param("City"),req.param("State"),req.param("ZipCode"),
        		 req.param("Contact"),req.param("Email"),req.param("CardNumber"),req.param("CardCVV"),req.param("CardEXP"),req.param("CardZIP"),req.param("CardPWD"),1/*req.session.customerid*/],
        		function(err,rows) {
        			
        	if(err) {                              
        				throw err;
        			}
        			var json_responses = {"statusCode" : 200};
        			res.send(json_responses);
        });
	});
};


//Loading Existing Rides  for the Customer
exports.customerHistory = function(req,res){
		console.log("I will load History page");
		res.render('customerRidesHistory');

}

//Customer Billing and Ride History

exports.customerRideHistory = function(req, res){
	
	var Customer_ID = req.session.username;
	Customer_ID = "3";
	console.log(Customer_ID);
	var customerBillHistory =  " select * from UBER.Ride_History natural join UBER.Driver natural join UBER.Customer where Customer_ID = '"+Customer_ID+"'; ";
		
		console.log("Query is:"+customerBillHistory);

		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			} else {
			
				console.log("sending result back to the controller");
				console.log(results);
				res.send(results);

			}

		},customerBillHistory);

		};