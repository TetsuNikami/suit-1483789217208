//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
console.log('Speed UI Tool α- new App.js start');

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

//POSTパラメータ取得用 body-parser設定 (express4からurlencoded()とjson()必要)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//index.jsを配置するサーバー側のルート・ディレクトリを指定しcall (Bluemix版に追加)
var server = require('./server');
app.use('/', server);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});



/*
// POSTパラメータ取得用 body-parser設定 (express4からurlencoded()とjson()必要)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// index.jsを配置するサーバー側のルート・ディレクトリを指定しcall
var server = require('./server');
app.use('/', server);


//環境変数にポート番号が無ければ、port=3000 設定
var port = (process.env.VCAP_APP_PORT || 3000);
// サーバー開始 （ "throw er;" エラーが出力されたらポート重複）
app.listen(port);
console.log('app.js started on port ' + port);
*/