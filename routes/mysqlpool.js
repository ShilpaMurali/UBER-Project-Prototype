var ejs=require('ejs');
var mysql=require('mysql');

exports.getConnection=function(req,res){
var pool  = mysql.createPool({
	  connectionLimit : 100,
	  host: "localhost",
		user: "root",
		password: "admin",
		database:"uber"
	});
return pool;
};

	

