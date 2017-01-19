// expressアプリ・フレームワークの設定
var express = require('express');
var app = express();

console.log('Speed UI Tool α- new App.js start');

// POSTパラメータ取得用 body-parser設定 (express4からurlencoded()とjson()必要)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// index.htmlの /public ディレクトリ設定
app.use(express.static(__dirname + '/public'));

// index.jsを配置するサーバー側のルート・ディレクトリを指定しcall
var server = require('./server');
app.use('/', server);

/* LOCAL: */
//LOCAL: 環境変数にポート番号が無ければ、port=3000 設定
var port = (process.env.VCAP_APP_PORT || 3000);
// サーバー開始 （ "throw er;" エラーが出力されたらポート重複）
app.listen(port);
console.log('app.js started on port ' + port);
/**/


/* Bluemix
//cfenv provides access to your Cloud Foundry environment
//for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

//get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
// print a message when the server starts listening
console.log("server starting on " + appEnv.url);
});
*/

