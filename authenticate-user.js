var express 	= require('express');
var bodyparser 	= require('body-parser');
var https 		= require('https');
var querystring = require('querystring');
var app 		= new express();

require('dotenv').config();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.set('view engine', 'html');



app.get('/login', function(req, res){

	var url 			= 'https://stackexchange.com/oauth';
	var client_id 		= 7494;
	var redirect_uri 	= 'http://localhost:8000/approve';
	var scope 			= 'no_expiry';

	var query 			= url + '?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&scope=' + scope;

	res.writeHead(301, {Location: query});
	res.end();

});


app.get('/approve', function(req, res){

	var code = req.query.code;

	var reqData = querystring.stringify({
		client_id : process.env.client_id,
		client_secret : process.env.client_secret,
		code : code,
		redirect_uri : 'http://localhost:8000/approve'
	});

	var reqOptions = {
		hostname: 'stackexchange.com',
		port: 443,
		path: '/oauth/access_token',
		method: 'POST',
		headers : { 'Content-Type' : 'application/x-www-form-urlencoded'}
	};
	
	var request = https.request(reqOptions, function(resSO)
	{
		var result = '';
		resSO.on('data',function(data){
			result += data;
		})
		resSO.on('end',function(){
			res.send(result);
		});
	});
	request.on('error',function(e){
		console.log("ERROR: "+e.message);
	})

	request.write(reqData);
	request.end();

	
});


app.get('/loggedIn', function(req, res){
	var access_token = req.query.access_token;
	res.send(access_token);
})

app.listen(8000);
