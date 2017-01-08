// テストデータ挿入用
exports.insertTestData = function(db) {

	//ユニークなID（UUID）を取得するためのユーティリティ
	var uuid = require('node-uuid');

	var date = new Date();
//	var now = date.toFormat("YYYY/MM/DD HH24:MI:SS");
	var now = date.toFormat("YYYY/MM/DD HH24:MI");

	var docs = [
	        //DBカタログ
			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "dbeaz_db_list",
			dbeaz_db : "DB",
			col_list : [  "Opportunity List" ,"Name List", "DB1" ]
			},

	        //Opportunity DBのカラムのリスト
			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "cols_name",
			dbeaz_db : "Opportunity List",
			col_list : [ "名称" ,"金額", "予定日", "ステータス", "メモ"]
			},

			//Opportunity DBの各ドキュメント
			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Opportunity List",
			col_list : [ "都市銀行" ,"10", "2016/1/1", "提案中", "お客様都合により契約遅延"]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Opportunity List",
			col_list : [ "地方銀行" ,"5", "2015/10/1", "契約", "契約処理中"]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Opportunity List",
			col_list : [ "信託銀行" ,"6", "2016/4/1", "提案", "提案交渉中"]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Opportunity List",
			col_list : [ "ある銀行" ,"3", "2015/12/1", "提案", "内定"]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Opportunity List",
			col_list : [ "メガ銀行" ,"100", "2016/7/1", "OI", "OI中"]
			},


	        //Name Listの DBのカラムのリスト
			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "cols_name",
			dbeaz_db : "Name List",
			col_list : [ "名" ,"属性" ]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Name List",
			col_list : [ "田中" ,"男" ]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Name List",
			col_list : [ "鈴木" ,"男" ]
			},

			{uuid : uuid.v4(),
			date : now,
			dbeaz_id : "a",
			dbeaz_db : "Name List",
			col_list : [ "佐藤" ,"女" ]
			},

		];

	db.save(docs);
	console.log('testdata.js docs saved: ' + JSON.stringify(docs));


/*




	var newdoc = {
		uuid : uuid.v4(),
		date : now,
		dbeaz_id : "dbeaz_db_list",
		dbeaz_db : "Opportunity List",
		col_list : [ "Opportunity List" ,"Name List", "DB_DB1" ]
	};


	// 項目の保存
//	db.save(req.body.uuid, req.body);
	db.save(newdoc.uuid, newdoc);
	console.log('testdata.js saved: ' + JSON.stringify(newdoc));


	// カラム名のリスト
	newdoc.uuid = uuid.v4();

	date = new Date();
	now = date.toFormat("YYYY/MM/DD HH24:MI");
	newdoc.date = now;

	newdoc.dbeaz_id = "cols_name";
	newdoc.dbeaz_db = "Opportunity List";
	newdoc.col_list = [ "名称" ,"金額", "予定日", "ステータス", "メモ"];

	// 項目の保存
	db.save(newdoc.uuid, newdoc);
	console.log('testdata.js saved: ' + JSON.stringify(newdoc));

	// #1
	newdoc.uuid = uuid.v4();

	date = new Date();
//	now = date.toFormat("YYYY/MM/DD HH24:MI:SS");
	now = date.toFormat("YYYY/MM/DD HH24:MI");
	newdoc.date = now;

	newdoc.dbeaz_id = "Opportunity List";
	newdoc.col_list = [ "都市銀行" ,"10", "2016/1/1", "提案中", "お客様都合により契約遅延"];

	// 項目の保存
	db.save(newdoc.uuid, newdoc);
	console.log('testdata.js saved: ' + JSON.stringify(newdoc));

	// #2
	newdoc.uuid = uuid.v4();

	date = new Date();
	now = date.toFormat("YYYY/MM/DD HH24:MI");
	newdoc.date = now;

	newdoc.dbeaz_id = "Opportunity List";
	newdoc.col_list = [ "地方銀行" ,"5", "2016/10/1", "契約", "契約処理中"];

	// 項目の保存
	db.save(newdoc.uuid, newdoc);
	console.log('testdata.js saved: ' + JSON.stringify(newdoc));

	// #3
	newdoc.uuid = uuid.v4();

	date = new Date();
	now = date.toFormat("YYYY/MM/DD HH24:MI");
	newdoc.date = now;

	newdoc.dbeaz_id = "Opportunity List";
	newdoc.col_list = [ "信託銀行" ,"6", "2016/4/1", "提案", "提案交渉中"];

	// 項目の保存
	db.save(newdoc.uuid, newdoc);
	console.log('testdata.js saved: ' + JSON.stringify(newdoc));

	// #4
	newdoc.uuid = uuid.v4();

	date = new Date();
	now = date.toFormat("YYYY/MM/DD HH24:MI");
	newdoc.date = now;

	newdoc.dbeaz_id = "Opportunity List";
	newdoc.col_list = [ "ある銀行" ,"8", "2016/1/1", "OI", "OI中"];

	// 項目の保存
	db.save(newdoc.uuid, newdoc);
	console.log('testdata.js saved: ' + JSON.stringify(newdoc));

	// #5
	newdoc.uuid = uuid.v4();

	date = new Date();
	now = date.toFormat("YYYY/MM/DD HH24:MI");
	newdoc.date = now;

	newdoc.dbeaz_id = "Opportunity List";
	newdoc.col_list = [ "メガ銀行" ,"300", "2016/4/1", "OI", "OI中"];

	// 項目の保存
	db.save(newdoc.uuid, newdoc);
	console.log('testdata.js saved: ' + JSON.stringify(newdoc));
*/
};