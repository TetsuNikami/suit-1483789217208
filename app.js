// expressアプリ・フレームワークの設定
var express = require('express');
var app = express();
console.log('Speed UI Tool - App.js express called');

// POSTパラメータ取得用 body-parser設定 (express4からurlencoded()とjson()必要)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// index.htmlの /public ディレクトリ設定
app.use(express.static(__dirname + '/public'));

// index.jsを配置するサーバー側のルート・ディレクトリを指定しcall
var server = require('./server');
app.use('/', server);

//環境変数にポート番号が無ければ、port=3000 設定
var port = (process.env.VCAP_APP_PORT || 3001);
// サーバー開始 （ "throw er;" エラーが出力されたらポート重複）
app.listen(port);
console.log('app.js started on port ' + port);
