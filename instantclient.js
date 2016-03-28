#!/usr/bin/env node

var Cheerio		= require('cheerio');
var Decompress	= require('decompress');
var path		= require("path");
var fs			= require("fs");
var Readline	= require('readline');
var ic_config	= require('./instantclient_config.json');
var ic_packages	= ['basic','sdk'];
var dir			= path.join(process.cwd(), ic_config.folder);
var username;
var password;
var oam_req;
var $;
var rl;

var rl_open = function(){
	rl = Readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
};

var mkdirp = function(dir, cb) {
	if (dir === ".") return cb();
	fs.stat(dir, function(err) {
		if (err == null) return cb(); // already exists

		var parent = path.dirname(dir);
		mkdirp(parent, function() {
			console.log('Directory (' + ic_config.folder + ') created.');
			fs.mkdir(dir, cb);
		});
	});
};

var bytesToSize = function(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};

var request = require('request');
var j = request.jar();

var beginPrompt = function(){
	console.log('');
	console.log('Would you like to install the Oracle Instant Client files?');
	rl_open();
	rl.question('Press (Y) to Install, anything else to Cancel? ', function(answer) {
		rl.close();
		if(answer != 'Y' && answer != 'y') {
			return;
		}
		agreementPrompt();
	});
};

var agreementPrompt = function(){
	console.log('');
	console.log('You must accept the OTN Development and Distribution License Agreement for Instant Client to download this software.');
	console.log('URL to Agreement: http://www.oracle.com/technetwork/licenses/instant-client-lic-152016.html');
	rl_open();
	rl.question('Press (Y) to Accept the License Agreement, anything else to Cancel? ', function(answer) {
		rl.close();
		if(answer != 'Y' && answer != 'y') {
			console.log('In order to download Oracle Instant Client, you must agree to License Agreeement.');
			console.log('');
			return;
		}
		j.setCookie(request.cookie('oraclelicense=accept-ic_winx8664-cookie; domain=.oracle.com'), 'http://download.oracle.com');
		credentialsPrompt();
	});
};

var credentialsPrompt = function(){
	var u = function(){
			rl_open();
			rl.question('Please enter your username: ', function(answer) {
				rl.close();
				if(answer) {
					username = answer;
					p();
				}
				else {
					u();
				}
			});
		},
		p = function(){
			rl_open();
			rl.question('Please enter your password: ', function(answer) {
				rl.close();
				if(answer) {
					password = answer;
					get_oam(loginRequest);
				}
				else {
					p();
				}
			});
		};

	console.log('');
	console.log('You must have an Oracle Account to continue.');
	console.log('You can register for a free account here: https://profile.oracle.com/myprofile/account/create-account.jspx');
	u();
};

var get_oam = function(cb){
	var url	= ic_config[ic_config.defaultversion][process.platform][process.arch]['basic'].url;
	request({
			url: url,
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
				'Referer': 'http://www.oracle.com/technetwork/topics/winx64soft-089540.html',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'Accept-Language': 'en-US,en;q=0.8'
			},
			jar: j,
			followAllRedirects: true
		},
		function callback(error, response, body) {
			if (!error) {
				$ = Cheerio.load(body);
				oam_req = $('input[name="OAM_REQ"]').val();
				//console.log(oam_req);
				cb();
			}
			else {
				console.error(error);
			}
		}
	);
};

var loginRequest = function() {
	request({
			url: 'https://login.oracle.com/oam/server/sso/auth_cred_submit',
			method: 'POST',
			headers: {
				'Cache-Control': 'max-age=0',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
				'Referer': 'https://login.oracle.com/mysso/signon.jsp',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'Accept-Language': 'en-US,en;q=0.8'
			},
			jar: j,
			followAllRedirects: true,
			form: {
				'ssousername': username,
				'password': password,
				'OAM_REQ': oam_req
			}
		},
		function callback(error, response, body) {
			if (!error) {
				if(response.request.uri.host == 'login.oracle.com') {
					console.log('Login failed.');
					credentialsPrompt();
				}
				else createFolder();
			}
			else console.error(error);
		}
	);
};

var createFolder = function() {
	var createIt = function() {
			mkdirp(dir, function(){
				ic_packages.forEach(function(pkg){downloadPkg(pkg);});
			});
		};

	if(fs.existsSync(dir)){
		console.log('');
		console.log('Directory (' + ic_config.folder + ') already exists!');
		console.log('If you continue, it will be deleted to allow for the download and extraction of the latest files.');
		rl_open();
		rl.question('Press (Y) to continue, anything else to Cancel? ', function(answer) {
			rl.close();
			if(answer != 'Y' && answer != 'y') {
				console.log('User aborted.');
				console.log('');
				return;
			}
			deleteFolderRecursive(dir);
			console.log('Directory (' + ic_config.folder + ') deleted.');
			createIt();
		});
	}
	else {
		createIt();
	}
};

var downloadPkg = function(pkg) {
	var fileObj			= ic_config[ic_config.defaultversion][process.platform][process.arch][pkg];
	var fn				= fileObj.fn;
	var fullPathToFile	= path.join(dir, fn);
	var url				= ic_config[ic_config.defaultversion][process.platform][process.arch][pkg].url;
	var fileStream		= fs.createWriteStream(fullPathToFile);

	request({
			url: url,
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
				'Referer': 'https://login.oracle.com/mysso/signon.jsp',
				'Accept-Encoding': 'gzip, deflate, sdch',
				'Accept-Language': 'en-US,en;q=0.8'
			},
			jar: j,
			followAllRedirects: true,
			form: {
				'ssousername': username,
				'password': password,
				'OAM_REQ': oam_req
			}
		},
		function callback(error, response, body) {
			if (!error) {
				console.log(fn + ' downloaded - ' + bytesToSize(response.headers['content-length']));
			}
			else console.error(error);
		}
	)
	.pipe(fileStream)
	.on('close', function() {
		new Decompress()
			.src(fullPathToFile)
			.dest(dir)
			.use(Decompress.zip({strip: 1}))
			.run(function(error) {
				if(error) {
					console.error(error);
					return;
				}
				console.log(fn + " extracted");
				fs.unlink(fullPathToFile, function(error) {
					if(error) {
						console.error(error);
						return;
					}
					console.log(fn + " deleted");
				});
			});
	});
};

beginPrompt();
