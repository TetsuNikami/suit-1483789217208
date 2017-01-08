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

// データベース接続
/* comment out for UT
var db = new (cradle.Connection)(host, port, options).database('dbeaz');
*/
console.log('dbeaz_UT.js to be DB connected to: %s, port: %s', host, port);

// DBname: dbeaz で SearchIndexのkeyは、uuid (_design/dbeaz, Index= uuid_index)
//	dbeaz_id: dbeaz_db_list はcontentsは、dblist: の中に、db[1], db[2], db[3]...
// IndexName(view) = cols_view は {uuid, date, dbeaz_id, col_list}
// 	dbeaz_id: xxx_db, date: 0, cols_list: の中に、col[1], col[2], col[3]...
//	dbeaz_id: xxx_db, date: 日付, 後の中身は、DBのcols_listに応じて

// 1 doc record追加
exports.addNewDB = function(newDBName, req, callback) {
	var id = uuid.v4();
	req.body.uuid = id;

	var date = new Date();
	var now = date.toFormat("YYYY/MM/DD HH24:MI");
	req.body.date = now;

	req.body.dbeaz_id = "dbeaz_db_list";
	req.body.dbeaz_db = newDBName

	currentDBList.push( newDBName );
	req.body.col_list = currentDBList;

	// 項目の保存
////	db.save(id, req.body);
	console.log('dbeaz_UT.js addNewDB: ' + JSON.stringify(req.body));

	// テストデータ挿入用
////var testdata = require('./testdata');
////testdata.insertTestData(req, db);

	doc = {
		uuid : req.body.uuid,
		date : req.body.date,
		dbeaz_id : req.body.dbeaz_id,
		dbeaz_db : req.body.dbeaz_db,
		col_list : currentDBList
	};

	callback(null, doc);
}; // addDoc


//1 doc record追加
exports.addDoc = function(req, callback) {

	// テストデータ挿入用
	var testdata = require('./testdata');
////	testdata.insertTestData(req, db);


	doc = {
		uuid : req.body.uuid,
		date : req.body.date,
		dbeaz_id : req.body.dbeaz_id,
		col_list : req.body.col_list
	};

	callback(null, doc);
}; // addDoc


//全件削除
exports.removeAll = function() {

	console.log("dbeaz_UT.js removeAll...");

/* comment out for UT
	// 全件検索を、作成したview名 items_view にて実行
	 db.view('dbeaz/cols_view', function (err, rows) {
		 if (!err) {
			 rows.forEach(function (id, row) {
				db.remove(id);
				console.log("dbeaz.js removeAll...key is: %s", id);
			 });
		 } else { console.log("dbeaz.js removeAll...error: " + err); }

	 });
*/
};


// DB全件検索
exports.addAllDocs = function(callback) {
/* comment out for UT
	// 全件検索を、作成したview名 items_view にて実行
	db.view('dbeaz/cols_view', function (err, docs) {
		 if (!err) {
			 docs.forEach(function (id, doc) {
				 console.log("dbeaz.js returnTable...key: %s, row: %s", id, JSON.stringify(doc));
			 });
		 } else { console.log("dbeaz.js returnTable...error: " + err); }

		callback(null, docs)
	});
*/
};


//最初の画面表示で、プルダウンリストにDBリストを表示
exports.getDBList = function(db_id, callback) {
	var docs = [];
	var key = { key : db_id };

/* comment out for UT
	db.view('dbeaz/dbeaz_id_view', key,  function (err, docs) {
	 if (!err) {
	 } else { console.log("dbeaz.js getDBList...error: " + err); }

	 callback(null, docs)
	}); // db.view
*/



	var newdoc = {
		value: {
			uuid : uuid.v4(),
			date : "2015/01/01 12:00",
			dbeaz_id : "dbeaz_db_list",
			dbeaz_db : "Opportunity List",
			col_list : [ "Opportunity List" ,"Name List", "DB_DB1" ]
		}
	};

//	docs = docs.concat( newdoc );
	docs = [ newdoc ];

	console.log("dbeaz_UT.js getDBList...docs: %s", JSON.stringify(docs));

	callback(null, docs)

}; // post


//特定DBのIDを渡すことで、そのDB_IDのカラム名取得
exports.getColumnRow = function(db_id, callback) {
	// dbeaz_db のIndexをはらないと、最初のDBアクセスが遅い？
	var colname_key = { key : "cols_name", dbeaz_db : db_id };
	var colname_row = {};
	var doc = {};

	console.log("dbeaz_UT.js getColumnRow...colname_key: " + JSON.stringify(colname_key) );

/* comment out for UT
	db.view('dbeaz/dbeaz_id_view', colname_key,  function (err, colname_rows) {
		if (!err) {
			 colname_rows.forEach(function (id, colname_row) {
				 console.log("app.js getColumnRow...colname key: %s, row: %s", id, JSON.stringify(colname_row));
				 doc = colname_row;
				 currentDBList = colname_row.col_list;
			 });
		} else { console.log("dbeaz.js getColumnRow...colname error: " + err); }

		console.log("dbeaz.js getColumnRow...colname row: %s", JSON.stringify(doc));
		callback(null, doc)
	}); // 1st db.view
*/


	doc = {
			uuid : uuid.v4(),
			date : now,
			dbeaz_id : "cols_name",
			dbeaz_db : "Opportunity List",
			col_list : [ "名称" ,"金額", "予定日", "ステータス", "メモ"]
		};

	callback(null, doc);

}; // post


//特定DBのIDを渡すことで、そのDB_IDの全レコード(Docs)取得
exports.getDocs = function(db_id, callback) {
	// dbeaz_db のIndexをはらないと、最初のDBアクセスが遅い？
	var colname_key = { key : "cols_name", dbeaz_db : db_id };
	var colname_row = {};
	var docs = [];
	var i = 0;

	console.log("dbeaz_UT.js getDocs...colname_key: " + JSON.stringify(colname_key) );

		var key = { key : db_id };
		console.log("dbeaz.js getDocs...key: " + JSON.stringify(key) );


/* comment out for UT
		db.view('dbeaz/dbeaz_id_view', key,  function (err, rows) {
			//console.log("app.js getDocs...rows" + JSON.stringify(rows));

			if (!err) {
			 rows.forEach(function (id, row) {
				 console.log("dbeaz.js getDocs...%s, key: %s, row: %s", i, id, JSON.stringify(row));
				 docs[i] = row;
				 i ++;
			 });
			} else { console.log("dbeaz.js getDocs...error: " + err); }

			console.log("dbeaz.js getDocs return: " + JSON.stringify(docs));
			callback(null, docs)
		}); // 2nd db.view
*/

	docs = [
			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "Opportunity List",
			col_list : [ "都市銀行" ,"10", "2016/1/1", "提案中", "お客様都合により契約遅延"]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "Opportunity List",
			col_list : [ "地方銀行" ,"5", "2016/10/1", "契約", "契約処理中"]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "Opportunity List",
			col_list : [ "信託銀行" ,"6", "2016/4/1", "提案", "提案交渉中"]
			}
		   ];


	callback(null, docs);

}; // post

