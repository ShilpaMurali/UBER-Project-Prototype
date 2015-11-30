var mysql = require('mysql');
var pool=require('./mysqlpool');
var connection=pool.getConnection(function(err,connection){});
var Driver_Id;
exports.login=function(req,res)
{	console.log("Inside Login");
	var email, password;
	
	email=req.param("email");
	password=req.param("password");
	console.log(email+" "+password);
	var sql_query="SELECT * FROM driver WHERE D_Email=" + connection.escape(email) + " AND D_Password="+connection.escape(password);
	//console.log(sql_query);
	connection.query(sql_query,function(err,rows)
	{
		if(err){
			throw err;
		}
		if(rows.length === 0){
			res.render('driverSignin');
			
		}
		else{
			//req.session.username=rows[0].D_Firstname;
			res.render('maps');	
			
			Driver_Id = rows[0].Driver_ID ;
			//req.session.Driver_Id = Driver_Id;
			//console.log( "Driver Session " + req.session.Driver_Id);
		}
	});
};





exports.logout = function(req,res)
{
		req.session.destroy();
		res.redirect('/');
};