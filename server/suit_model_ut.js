// Date()で現在時刻を取得するためのユーティリティ
var dateutil = require('date-utils');

//ユニークなID（UUID）を取得するためのユーティリティ
var uuid = require('node-uuid');

// Cloudant用アクセス・モジュール「cradle」設定
var cradle = require('cradle');

// Cloudant DB接続情報取得
var services = JSON.parse(process.env.VCAP_SERVICES);
var credentials = services['cloudantNoSQLDB'][0].credentials;
var host = credentials.host;
var port = credentials.port;
var options = {
  cache : true,
  raw : false,
  secure : true,
  auth : {
    username : credentials.username,
    password : credentials.password
  }
};

var currentDBList = [];
var DBList_id = "";
var DBList_uuid = "";

// データベース接続
var db = new (cradle.Connection)(host, port, options).database('dbeaz');
console.log('suit_model.js DB connected to: %s, port: %s', host, port);



// DB情報
// DB名: dbeaz  View名: cols_view  （Indexは、uuid_index）
// カラム情報
// uuid:	ユニークID（uuid.v4()）
// date: 	ドキュメント（レコード）生成時刻
// dbeaz_id:	「dbeaz_db_list」はDB名リスト。「cols_name」はそのDBのカラム名のリスト。「a」は1アイテム
// dbeaz_db: 	DB名
// col_list:	そのレコードのカラム値 例： ["a","b","c" ]


//UIのデータ項目の順序を保管
exports.postUIDataItems = function(screen, uiDataItems, callback) {
	var docs = [];

	console.log("suit_model_ut.js postUIDataItems(): " + uiDataItems );

	callback(null, docs);
}


//データ辞書からデータ項目リストを取得
exports.getDataItems = function(db_name, callback) {
	// dbeaz_db のIndexをはらないと、最初のDBアクセスが遅い？
	var docs = [];

/*
	var colname_key = { key : [ "a", db_name ] };
	var colname_row = {};
	var i = 0;

	console.log("dbeaz.js getDocs...colname_key: " + JSON.stringify(colname_key) );

	db.view('dbeaz/list_docs', colname_key,  function (err, rows) {

		if (!err) {
		 rows.forEach(function (id, row) {
			 //console.log("dbeaz.js getDocs...%s, key: %s, row: %s", i, id, JSON.stringify(row));
			 docs[i] = row;
			 i ++;
		 });
		} else { console.log("dbeaz.js getDocs...error: " + err); }

		//console.log("dbeaz.js getDocs return: " + JSON.stringify(docs));
		callback(null, docs)
	}); // 2nd db.view
*/

	docs = [
	     // blank
			{uuid : uuid.v4(),
			data_entity : "",
			data_item : "blank1",
			data_type : "",
			data_length : "0",
			},

			{uuid : uuid.v4(),
			data_entity : "",
			data_item : "blank2",
			data_type : "",
			data_length : "0",
			},

			{uuid : uuid.v4(),
			data_entity : "",
			data_item : "blank3",
			data_type : "",
			data_length : "0",
			},

			{uuid : uuid.v4(),
			data_entity : "",
			data_item : "blank4",
			data_type : "",
			data_length : "0",
			},


		// 顧客情報
			{uuid : uuid.v4(),
			data_entity : "顧客情報TBL",
			data_item : "顧客番号",
			data_type : "String",
			data_length : "10",
			},

			{uuid : uuid.v4(),
			data_entity : "顧客情報TBL",
			data_item : "顧客名",
			data_type : "String",
			data_length : "10",
			},

			{uuid : uuid.v4(),
			data_entity : "顧客情報TBL",
			data_item : "顧客姓",
			data_type : "String",
			data_length : "10",
			},

			{uuid : uuid.v4(),
			data_entity : "顧客情報TBL",
			data_item : "顧客年齢",
			data_type : "long",
			data_length : "3",
			},

		// 受注TBL
			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "受注番号",
			data_type : "String",
			data_length : "12",
			},

			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "受注日",
			data_type : "String",
			data_length : "10",
			},

			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "お客様番号",
			data_type : "String",
			data_length : "8",
			},

			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "受注姓",
			data_type : "String",
			data_length : "10",
			},

			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "受注名",
			data_type : "String",
			data_length : "10",
			},


			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "企業名",
			data_type : "String",
			data_length : "10",
			},

			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "住所1",
			data_type : "String",
			data_length : "10",
			},

			{uuid : uuid.v4(),
			data_entity : "受注TBL",
			data_item : "住所2",
			data_type : "String",
			data_length : "10",
			},

		   ];

	callback(null, docs);

}; // getDataItems


