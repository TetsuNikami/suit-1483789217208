// expressフレームワークへのルーターを設定(GET/POSTなど)。app.jsではapp
var express = require('express');
var router = express.Router();

// Date()で現在時刻を取得するためのユーティリティ
var dateutil = require('date-utils');

//ユニークなID（UUID）を取得するためのユーティリティ
var uuid = require('node-uuid');

// Cloudant用アクセス・モジュール「cradle」設定
var cradle = require('cradle');

// SUIT server side Model (UT or DB access)
/*var suit_model = require('./suit_model');		// for Unit Test   */
var suit_model = require('./suit_model_ut');		// for Unit Test   */


//データ辞書からの全データ項目取得
router.post('/getDataItems', function(req, res){
	var docs = {};

	suit_model.getDataItems(req.body.dbeaz_id, function (err, docs) {		// suit_model.getDataItems call
		console.log("index.js getDataItems...docs: %s", JSON.stringify(docs));
	  		res.send(docs);
	  	});
}); // post

//データ辞書からの全データ項目取得
router.post('/postUIDataItems', function(req, res){
	var docs = {};

	suit_model.postUIDataItems(req.body.screen, req.body.items, function (err, docs) {		// suit_model.getDataItems call
		console.log("index.js postDataItems...docs: %s", JSON.stringify(docs));
	  		res.send(docs);
	  	});
}); // post

module.exports = router;

