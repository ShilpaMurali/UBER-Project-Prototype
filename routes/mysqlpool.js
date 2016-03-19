var ejs=require('ejs');
var mysql=require('mysql');

exports.getConnection=function(req,res){
var pool  = mysql.createPool({
	  connectionLimit : 100,
	  host: "uber.c9fsewowtunx.us-west-2.rds.amazonaws.com",
		user: "msensor_team20",
		password: "msensor_team20",
		database:"UBER"
	});
return pool;
};

	

