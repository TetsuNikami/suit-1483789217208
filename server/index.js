// expressフレームワークへのルーターを設定(GET/POSTなど)。app.jsではapp
var express = require('express');
var router = express.Router();

// Date()で現在時刻を取得するためのユーティリティ
var dateutil = require('date-utils');

//ユニークなID（UUID）を取得するためのユーティリティ
var uuid = require('node-uuid');

// Cloudant用アクセス・モジュール「cradle」設定
var cradle = require('cradle');

// DBeaz DB Model
      var dbeaz = require('./dbeaz');			// for DB access /**/
/*    var dbeaz = require('./dbeaz_ut');		// for Unit Test   */


// 「追加」ボタンの id=addDB, ui_item.jsの url:'/addDB'でcall
router.post('/addDB', function(req, res){
	var doc = {};
	dbeaz.addNewDB(req.body.newDBName, req.body.newColumnNames, function (err, doc) {
		console.log("index.js addDB...DBName: %s, doc: %s", req.body.newDBName, JSON.stringify(doc));
		res.send(doc);
	});
});


// Itemの「新規追加」ボタンの id=addItem, ui_item.jsの url:'/addItem'でcall
router.post('/addItem', function(req, res){
	var doc = {};
	dbeaz.addItem(req.body.db_name, req.body.item, function (err, doc) {
		console.log("index.js add...doc: %s", JSON.stringify(doc));
		res.send(doc);
	});
});


//「追加」ボタンの id=add, ui_item.jsの url:'/add'でcall
router.post('/addTestData', function(req, res){
	var doc = {};
	dbeaz.addTestData(req, function (err, doc) {
		console.log("index.js addTestData...doc: %s", JSON.stringify(doc));
		res.send(doc);
	});
});


//「全件削除」ボタンの id=removeAll, ui_item.jsの url:'/removeAll'でcall
router.post('/removeAll', function(req, res){
	dbeaz.removeAll();	// 全件削除
	res.send({});
});


//「全件表示」ボタンの id=getAll, ui_item.jsの url:'/getAll'でcall
router.post('/getAll', function(req, res){
	var docs = {};
	dbeaz.getAllDocs(function (err, docs) {
		console.log("index.js getAllDocs...docs: %s", JSON.stringify(docs));
		res.send(docs);
	});
});


//最初の画面表示で、DBリストを表示
router.post('/getDBList', function(req, res){
	var docs = {};

	dbeaz.getDBList("dbeaz_db_list", function (err, docs) {	// DBeazに現在登録されているDBのリストを取得

		console.log("index.js getDBList...docs: %s", JSON.stringify(docs));
		res.send(docs);
	});
}); // post


//特定DB名のカラム名取得
router.post('/getColumnRow', function(req, res){
	var doc = {};

	console.log("index.js getColumnRow");
	console.log("index.js getColumnRow...req: %s", req.body.dbeaz_id);

	dbeaz.getColumnRow(req.body.dbeaz_id, function (err, doc) {
		console.log("index.js getColumnRow...doc: %s", JSON.stringify(doc));
		res.send(doc);
	});
}); // post


//特定DB名の全レコード(Docs)取得
router.post('/getDocs', function(req, res){
	var docs = {};

	dbeaz.getDocs(req.body.dbeaz_id, function (err, docs) {
		console.log("index.js getDocs...docs: %s", JSON.stringify(docs));
		res.send(docs);
	});
}); // post


//１項目のみ取得
router.post('/getItem', function(req, res){
	var docs = {};

	dbeaz.getItem(req.body.uuid, function (err, doc) {	// uuidの1つのアイテムDocを取得

		console.log("index.js getItem...doc: %s", JSON.stringify(doc));
		res.send(doc);
	});
}); // post



module.exports = router;

