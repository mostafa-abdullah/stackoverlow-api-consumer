var https = require('https');
var zlib = require('zlib');

// keyword to search in title
var intitle = "java";


var options = {
  hostname: 'api.stackexchange.com',
  port: 443,
  path: '/2.2/search?order=desc&sort=activity&intitle=' + intitle + '&site=stackoverflow',
  method: 'GET',
  headers: { 'Accept-Encoding': 'gzip,deflate' }
};
	
var result = "";

var req = https.request(options, (res) => {

  	// Identify the encoding type of the recieved content
  	var decompressType = res.headers['content-encoding'] || 'gzip';
  	
  	// create the appropriate decoding mechanism
  	var zip;
  	if(decompressType == 'gzip')
  		zip = zlib.createGunzip();
  	else
  		zip =zlib.createInflate();

  	// send the response through the zlib pipe
  	res.pipe(zip);


  	zip.on('data',function(data)
  	{
  		result += data;
  	})
  	zip.on('end', function()
  	{
  		// work on the decoded data here
  		console.log(JSON.parse(result));
  	})
  	zip.on('error', function(e)
  	{
  		console.log(e.message);
  	})
  
});
req.end();

req.on('error', (e) => {
  console.error(e.message);
});