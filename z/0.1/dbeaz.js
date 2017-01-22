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
console.log('dbeaz.js DB connected to: %s, port: %s', host, port);



// DB情報
// DB名: dbeaz  View名: cols_view  （Indexは、uuid_index）
// カラム情報
// uuid:	ユニークID（uuid.v4()）
// date: 	ドキュメント（レコード）生成時刻
// dbeaz_id:	「dbeaz_db_list」はDB名リスト。「cols_name」はそのDBのカラム名のリスト。「a」は1アイテム
// dbeaz_db: 	DB名
// col_list:	そのレコードのカラム値 例： ["a","b","c" ]


// 新規DB追加
exports.addNewDB = function(newDBName, newColumnNames, callback) {
	var doc = {};
	doc.id = DBList_id;
	doc.uuid = DBList_uuid;

	var date = new Date();
//	doc.date = date.toFormat("YYYY/MM/DD HH24:MI:SS");
	doc.date = date.toFormat("YYYY/MM/DD HH24:MI");

	doc.dbeaz_id = "dbeaz_db_list";
	doc.dbeaz_db = "DB";

	currentDBList.push( newDBName );
	doc.col_list = currentDBList;

	console.log('dbeaz.js addNewDB id: %s, uuid: %s, newDBName: %s, DBList: %s ', doc.id, doc.uuid, doc.dbeaz_db, doc.col_list);

	// 項目の保存
	db.save(doc.id, doc, function (err) {
		if (!err) {
			doc.id = uuid.v4();
			doc.uuid = doc.id;
			doc.dbeaz_id = "cols_name";
			doc.dbeaz_db = newDBName;
			doc.col_list = JSON.parse("["+ newColumnNames +"]");

			db.save(doc, function (err2) {
				if (!err) {
					console.log("dbeaz.js addNewDB created. newDBName: %s, newColumnNames: %s ", doc.dbeaz_db, JSON.stringify(doc.col_list));
				} else { console.log("dbeaz.js addNewDB.save2...error: " + err2); }
			}); // function err2
		} else { console.log("dbeaz.js addNewDB.save...error: " + err); }


		console.log('dbeaz.js DB List saved: ' + JSON.stringify(doc));

		var retdoc = {
			uuid : doc.uuid,
			date : doc.date,
			dbeaz_id : doc.dbeaz_id,
			dbeaz_db : doc.dbeaz_db,
			col_list : currentDBList
		};

		callback(null, retdoc);
	}); // save
}; // addDoc


//1 doc record追加
exports.addItem = function(db_name, req, callback) {
	var doc = {};
	doc.uuid = uuid.v4();
//	req.body.uuid = id;

	var date = new Date();
//	var now = date.toFormat("YYYY/MM/DD HH24:MI:SS");
	doc.date = date.toFormat("YYYY/MM/DD HH24:MI");

	doc.dbeaz_id = "a";
	doc.dbeaz_db = db_name;
	doc.col_list = req;

	// 項目の保存
	db.save(doc.uuid, doc);
	console.log('dbeaz.js addItem saved: ' + JSON.stringify(doc));

	callback(null, doc);
}; // addDoc


//1 doc update追加
exports.updateItem = function(db_name, uid, req, callback) {
	// 検索しID取得
	var colname_key = { "key" : uid };
	var doc = {};
	var id = 0;
	var i = 0;

	db.view('dbeaz/cols_view', colname_key,  function (err, row) {
		id = row[0].id;
		console.log("dbeaz.js updateItem row: " + JSON.stringify(row));

		// save upsated doc
		doc.uuid = uid;		//same uuid
		////doc._id  = id;	// different id
		////doc._rev = uuid.v4();	// no revise number

		var date = new Date();
		doc.date = date.toFormat("YYYY/MM/DD HH24:MI");

		doc.dbeaz_id = "a";
		doc.dbeaz_db = db_name;
		doc.col_list = req;

		// 項目の保存
		db.save( doc, function (err) {
			if (!err) {
				console.log('dbeaz.js updateItem saved: ' + JSON.stringify(doc));
				db.remove( id );		// remove old record
				console.log('dbeaz.js updateItem removed: '+ id);
			} else
				console.log('dbeaz.js updateItem error: ' + err);

			callback(null, doc);
		});

	}); // db.view
}; // updateItem


//1 doc remove
exports.removeItem = function(db_name, uid, callback) {
	// 検索しID取得
	var colname_key = { "key" : uid };
	var doc = {};
	var id = 0;
	var i = 0;

	db.view('dbeaz/cols_view', colname_key,  function (err, row) {
		id = row[0].id;
		console.log("dbeaz.js removeItem row: " + JSON.stringify(row));

		// save upsated doc
		doc.uuid = uid;

		db.remove( id, function (err) {
			if (!err) {
				console.log('dbeaz.js removeItem removed: ' + id);
			} else
				console.log('dbeaz.js removeItem error: ' + err);

			callback(null, doc);
		});
	}); // db.view
}; // removeItem


//テストデータ追加
exports.addTestData = function(req, callback) {
	// テストデータ挿入用
	var testdata = require('./testdata');
	testdata.insertTestData(db);


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
	var colname_key = {};

	// 全件検索を、作成したview名 items_view にて実行
	 db.view('dbeaz/cols_view', function (err, rows) {
		 if (!err) {
			for(var i=0; i<rows.length; i++) {		// error?
				db.remove( rows[i].id );
				//console.log("dbeaz.js removeAll...key is: %s, row: %s", rows[i].id,  JSON.stringify(rows[i]));
            } // for
		 } else { console.log("dbeaz.js removeAll...error: " + err); }
	 }); // db.view
};


// DB全件検索 こちらは今は使っていない
exports.addAllDocs = function(callback) {
	// 全件検索を、作成したview名 items_view にて実行
	db.view('dbeaz/cols_view', function (err, docs) {
		 if (!err) {
			 docs.forEach(function (id, doc) {
				 console.log("dbeaz.js returnTable...key: %s, row: %s", id, JSON.stringify(doc));
			 });
		 } else { console.log("dbeaz.js returnTable...error: " + err); }

		callback(null, docs)
	});
};


//最初の画面表示で、プルダウンリストにDBリストを表示
exports.getDBList = function(db_name, callback) {
	var docs = {};
	var key = { key : [ "dbeaz_db_list", "DB" ] };	//NG

	db.view('dbeaz/list_docs', key,  function (err, docs) {
	 if (!err) {
		 /**/
		 docs.forEach(function (id, doc) {
			 DBList_id = docs[0].id;
			 DBList_uuid = doc.uuid;
			 ////DBList_id = doc.uuid;
			 currentDBList = doc.col_list;
			 console.log("dbeaz.js getDBList...id: %s, uuid: %s, row: %s",  DBList_id, DBList_uuid, JSON.stringify(doc));
		 });

		 /**/
	 } else { console.log("dbeaz.js getDBList...error: " + err); }

	 callback(null, docs)
	}); // db.view
}; // post


//特定DBのIDを渡すことで、そのDB_IDのカラム名取得
exports.getColumnRow = function(db_name, callback) {
	// 二つのキーによるビューの検索
	var colname_key = { key : [ "cols_name", db_name ] };
	var colname_row = {};
	var doc = {};

	console.log("dbeaz.js getColumnRow...colname_key: " + JSON.stringify(colname_key) );

	db.view('dbeaz/list_docs', colname_key,  function (err, colname_rows) {
		if (!err) {
			 colname_rows.forEach(function (id, colname_row) {
				 console.log("dbeaz.js getColumnRow...colname key: %s, row: %s", id, JSON.stringify(colname_row));
				 doc = colname_row;
				 ////currentDBList = colname_row.col_list;
			 });
		} else { console.log("dbeaz.js getColumnRow...colname error: " + err); }

		//console.log("dbeaz.js getColumnRow...colname row: %s", JSON.stringify(doc));
		callback(null, doc)
	}); // 1st db.view
}; // post


//特定DBのIDを渡すことで、そのDB_IDの全レコード(Docs)取得
exports.getDocs = function(db_name, callback) {
	// dbeaz_db のIndexをはらないと、最初のDBアクセスが遅い？
	var colname_key = { key : [ "a", db_name ] };
	var colname_row = {};
	var docs = [];
	var i = 0;

	console.log("dbeaz.js getDocs...colname_key: " + JSON.stringify(colname_key) );

	db.view('dbeaz/list_docs', colname_key,  function (err, rows) {
		/* console.log("app.js getDocs...rows" + JSON.stringify(rows)); */

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
}; // getDocs


//uuidを渡すことで、1件のレコード(Doc)取得
exports.getItem = function(uid, callback) {
	var colname_key = { "key" : uid };
	var doc = [];
	var i = 0;
	/* console.log("dbeaz.js getItem: " + uid); */

//	db.get(uuid,  function (err, row) {		// id =/= uuid
	db.view('dbeaz/cols_view', colname_key,  function (err, row) {
		console.log("dbeaz.js getItem row: " + JSON.stringify(row[0].value));

		callback(null, row[0].value)
	}); // db.get
}; // getItem


