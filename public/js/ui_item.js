// ui_item.js ブラウザUI用 JavaScript (index.htmlより呼ばれる)

var currentDB = "";
console.log('ui_item init, getDBList ' + currentDB);


// 初期画面の表示で、POSTでindex.jsのgetDBListをコールしDB List取得、SELECTリストに表示
$.ajax({
	type: 'POST',
	data: {},
	contentType: 'application/json',
    url: '/getDBList',
    success: function(rows) {
         for(var i=0; i<rows.length; i++) {
    		//console.log('  DBList row '+ i +": "+ JSON.stringify(rows[i].value));

    		// 上部のSELECTリストに追加
    		for(var k=0; k<rows[i].value.col_list.length; k++) {
    			$("#select-db-list").append("<option value=\"" + rows[i].value.col_list[k] + "\">" + rows[i].value.col_list[k] + " </option>");
    			//console.log('ui_item DBList col_list '+ i + k +": "+ JSON.stringify(rows[i].value.col_list[k]));
   	     	}
   	   	}

         // currentDBがある場合は、リストのそこを表示
         if (currentDB!="") $("#select-db-list").val( currentDB );
    },
	error:  function(rows) { console.log('error getAll: ' + JSON.stringify(rows) ) }
}); // ajax


// Ajax events: button
 $(function(){
   console.log('ui_item.js function');


   //Items-Viewで「新DB追加」ボタンが押された場合のアクション
   $("#addDB").click(function(e){  e.preventDefault();
  	 var param = {};
  	 param.newDBName = $("#newDBName").val() || "";
  	 param.newColumnNames = $("#newColumnNames").val() || "";
  	 //改行を","に変換し前後に " をつける
  	 param.newColumnNames = "\""+param.newColumnNames.replace(/\n/g, "\",\"")+"\"";

  	 console.log('ui_item.js addDB ColumnNames: ' + param.newColumnNames);

  	 if ( param.newDBName != "" && param.newColumnNames != "" ) {
  	   	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /addNewDB呼び出し
  	   	$.ajax({
  	   		type: 'POST',
  	   		data: JSON.stringify(param),
  	   		contentType: 'application/json',
  	   		url: '/addDB',
  	   		success: function(rows) {
	  	   		setTimeout( function() {
	 	   			location.href = "./index.html?"+ encodeURI(param.newDBName) +"";  //sleepしないと先に実行
	  	   		}, 1500 );

  	   			currentDB = param.newDBName;
  	   		}, // success
  	        error:  function(data) { console.log('ui_item.js error addDB: ' + JSON.stringify(data)); }
  	    }); // $.ajax

  	 } else {
  		console.log('ui_item.js addDB error DBName: %s, ColumnNames: %s ', param.newDBName, param.newColumnNames);
  	 }
   	}); // #addDB


   // 追加ボタン（index.htmlのid=addItem）押下時 実行
   $("#addItem").click(function(e){  e.preventDefault();
    	var param = {};
    	param.db_name = currentDB;
    	param.item = [];
//    	param.item1 = $("#item1").val() || "";

    	var aItem = null;
   		for(var i=0; i<100; i++) {

   			aItem = $("#i"+ (i+1) ).val();
   			if(aItem==null) i = 100;
   			else   			param.item[i] = aItem;

   			console.log("ui_item.js addItem(): %s, %s ", i, param.item[i]);
   		}


    	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /add呼び出し
    	$.ajax({
    		type: 'POST',
    		data: JSON.stringify(param),
    		contentType: 'application/json',
            url: '/addItem',
            success: function(data) {

	  	   		setTimeout( function() {
	 	   			location.href = "./index.html?"+ encodeURI(currentDB) +"";  //sleepしないと先に実行
	  	   		}, 200 );

            	console.log('ui_item.js addItem data: ' + JSON.stringify(data));
            	////showTable(data);
            },
            error:  function(data) { console.log('error add: ' + JSON.stringify(data)); }
    	});
     }); // #addItem


   // テストデータ追加ボタン（index.htmlのid=addTestData）押下時 実行（テスト用）
   $("#addTestData").click(function(e){  e.preventDefault();
    	var param = {};
    	param.item1 = $("#item1").val() || "";

    	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /add呼び出し
    	$.ajax({
    		type: 'POST',
    		data: JSON.stringify(param),
    		contentType: 'application/json',
            url: '/addTestData',
            success: function(data) {
            	console.log('success add: ' + JSON.stringify(data));
            	////showTable(data);
            },
            error:  function(data) { console.log('error add: ' + JSON.stringify(data)); }
    	});

    	// 入力項目名を空白に
    	$("#item1").val('');
     }); // #add


   // 全件表示ボタン（index.htmlのid=getAll）押下時 実行
   $("#getAll").click(function(e){	e.preventDefault();
   		getAll();
   });

   // 全件削除ボタン（index.htmlのid=removeAll）押下時 実行
   $("#removeAll").click(function(e){	e.preventDefault();

    	// POSTでのajaxコールで、サーバーのapp.jsのapp.post呼び出し
    	$.ajax({
    		type: 'POST',
    		data: {},
    		contentType: 'application/json',
            url: '/removeAll',
            success: function(data) { console.log('success removeAll'); },
            error:  function(data) { console.log('error getAll: ' + JSON.stringify(data)); }
    	});

    	$("#tableItems").empty();
     });


/***
   // 各アイテム（行）のラジオボタン押下時 実行（アイテム選択）・・呼ばれない
	 $("input[type='radio']").change( function() {
  	  	var param = {};
  		param.item =  $( this ).val() || "";
  	   	console.log('success #ii: ' + param.item);
	 });
***/

 }); // $function


 function getDocs(currentDataTable) {
	var param = {};
	param.dbeaz_id = currentDB;
	console.log(" getDocs() dbeaz_id: " + currentDB);

   	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /getAll呼び出し
   	$.ajax({
   		type: 'POST',
   		data: JSON.stringify(param),
   		contentType: 'application/json',
   		url: '/getDocs',
   		success: function(rows) {
   			for(var i=0; i<rows.length; i++) {		// error?
            	var list = [ '<input type=radio name=ii onchange=onRadio() value='+rows[i].uuid+'>'+ rows[i].date ];
           		//console.log('getDocs()...list: '+ JSON.stringify(list) );

            	currentDataTable.row.add( list.concat( rows[i].col_list ) ).draw();
            } // for

   		}, // success
            error:  function(data) { console.log('error getDocs: ' + JSON.stringify(data)); }
    }); // $.ajax
 }


 function onRadio() {
	 console.log('ui_item.js onRadio selected: ' + document.db_view.ii.value );
	 getItem(document.db_view.ii.value);
}

//Ratioボタンで選択されたItemのuuidで、Item呼び出し
 function getItem(uuid) {
 	var param = {};
	param.uuid = uuid;
	console.log("getItem() uuid: " + uuid);
	var res = "";

	if (currentDB!="") {
   	 	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /getColumnNames呼び出し
    	$.ajax({
    		type: 'POST',
    		data: JSON.stringify(param),
    		contentType: 'application/json',
            url: '/getItem',
            success: function(row) {
            	// View表示（左）
          		console.log('showColumnRow()...row: '+ JSON.stringify(row));
           		//res = makeColumns(row);

           		for(var i=0; i<row.col_list.length; i++) {
           			if(i==0) $("#i0").val(row.date);

           			$("#i"+ (i+1) ).val(row.col_list[i]);
           			console.log("ui_item.js getItem(): "+row.col_list[i]);
           		}
            }, // success
            error:  function(row) { console.log('error showColumnRow: ' + JSON.stringify(row)); }
    	}); // $.ajax

	} else {
		console.log("ui_item.js...currentDB is blank:" + currentDB +".");
	}
} // getItem



 // サーバから取得した全データを、htmlテーブルに追加
 function showTable(data) {
   $("#tableItems").append("<tr></tr>")
   .find("tr:last")
   .append("<td>" + data.date + "</td>")
   .append("<td>" + data.uuid + "</td>")
   .append("<td>" + data.dbeaz_id + "</td>")
   .append("<td>" + JSON.stringify( data.col_list ) + "</td>")


   for(var i=0; i<data.col_list.length; i++) {
  	 if(i==0) $("#tableItems").append("<td>" + data.date + "</td>")
  	 $("#tableItems").append("<td>" + data.col_list[i] + "</td>")
		console.log(' row col_list '+ i +": "+ JSON.stringify(data.col_list[i]));
   }
 }; // showTable


 //DB-ViewのDB名が選択された時のアクション
 function changeDB() {
	 obj = document.db_view.select_db;

	 index = obj.selectedIndex;
	 //if (index != 0){
	    currentDB = obj.options[index].value;
	 //}

	 console.log('ui_item.js select changeDB(): ' + currentDB);

	 if (currentDB=="newDB") location.href = "./index.html ";				//DB名の引数無しでリロード
	 else					 location.href = "./index.html?"+currentDB+"";	//URLの引数にDB名を指定しリロード

 }


 //index.html表示時に、引数にDB名が指定してあれば、そのDBのカラム名を読み込み、getDocsをCALL
 function getColumnRow() {

	var row = {};
	currentDB = decodeURI( window.location.search.substring( 1 ) );
	console.log('getColmnRow() currentDB param: ' + currentDB);

 	var param = {};
	param.dbeaz_id = currentDB;
	console.log("getColumnRow() dbeaz_id: " + currentDB);
	var res = "";
	var res2 = "";

	if (currentDB!="") {
   	 	$("#itemTable").empty();

   	 	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /getColumnNames呼び出し
    	$.ajax({
    		type: 'POST',
    		data: JSON.stringify(param),
    		contentType: 'application/json',
            url: '/getColumnRow',
            success: function(row) {
            	// View表示（左）
          		console.log('showColumnRow()...row: '+ JSON.stringify(row));
           		res = makeColumns(row);

	        	 $("#viewTable").append("<thead>"+ res +"</thead>" );
	        	 $("#viewTable").append("<tfoot>"+ res +"</tfoot>" );

	        	 // .DataTable() でid=viewTable のtableに、jQuery DataTableを割り当てる
	        	 var currentDataTable = $('#viewTable').DataTable(
	        			 { bAutoWidth : false, aLengthMenu : [50,100,200,300], bProcessing : true });

	        	 getDocs( currentDataTable );

	        	 // Item表示（右）
	        	 res2 = makeItems(row);
	        	 $("#itemTable").append( res2 );

	        	 // .DataTable() でid=viewTable のtableに、jQuery DataTableを割り当てる
	        	 var currentDataTable2 = $('#itemTable').DataTable(
	        	 		 { bAutoWidth : true, bProcessing : true });

            }, // success
            error:  function(row) { console.log('error showColumnRow: ' + JSON.stringify(row)); }
    	}); // $.ajax

	} else {
		console.log("ui_item.js...currentDB is blank:" + currentDB +".");
	}
} // getColumnRos


//カラム名の行のみ表示
 function makeColumns(row) {
	 var res = "<tr>";

	 for(var i=0; i<row.col_list.length; i++) {
	  	 if(i==0) res = res.concat("<th>日時</th>");
		 res = res.concat("<th>" + row.col_list[i] + "</th>");
   }

	 res = res.concat("</tr>");
	 //console.log(' columnNames col_list: '+ res);

	 return res;
 }; // makeColumns


//Itemリストの表示
 function makeItems(row) {
	 var res = "<tr>";

	 for(var i=0; i<row.col_list.length; i++) {
		 if(i==0) {
			 res = res.concat("<tr><th width=\"90\">日時 (自動更新)</th>");
			 res = res.concat("<th> <input type=\"text\" id=\"i0\"> </th></tr>");
		 }

//		 res = res.concat("<tr><th width=\"80\"> " + row.col_list[i] + " </th>");
		 res = res.concat("<tr><th> " + row.col_list[i] + " </th>");
		 res = res.concat("<th> <input type=\"text\" style=\"width:100%; box-sizing:border-box\" id=\"i" + (i+1) + "\"> </th></tr>");
   }

	 res = res.concat("</tr>");
	 //console.log(' columnNames col_list: '+ res);

	 return res;
 }; // makeColumns






/*
 // getAllData from DBeaz DB for check  使用していない
 function getAll() {
//		$("#tableItems").empty();

 	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /getAll呼び出し
 	$.ajax({
 		type: 'POST',
 		data: {},
 		contentType: 'application/json',
         url: '/getAll',
         success: function(rows) {
             for(var i=0; i<rows.length; i++) {
         		console.log(' row '+ i +": "+ JSON.stringify(rows[i]));
         		showTable(rows[i].value);
             }
         },
         error:  function(data) { console.log('error getAll: ' + JSON.stringify(data)); }
 	}); // $.ajax
}
*/


 /*
  // サーバから取得した特定DBのカラム名を、htmlテーブルに追加。一行目のカラム名。
  function showColumnNames(data) {

 	 for(var i=0; i<data.col_list.length; i++) {
 		 if(i==0) $("#viewTable").append("<th>時間</th>")
 		 $("#viewTable").append("<th>" + data.col_list[i] + "</th>")
 		console.log(' columnNames col_list '+ i +": "+ JSON.stringify(data.col_list[i]));
    }

  }; // showColumnNames
 */


 /*
  // サーバから取得した特定DBのデータを、htmlテーブルに追加
  function showDocsTable(data) {

 	 var res = "";

 //   $("#viewTable").append("<tr>")
 //   .find("tr:last")

    console.log('showDosTable in ');


    for(var i=0; i<data.col_list.length; i++) {
//   	 if(i==0) $("#viewTable").append("<td>" + data.date + "</td>")
 	 if(i==0) res = res.concat("<td>" + data.date + "</td>");

//   	 $("#viewTable").append("<td>" + data.col_list[i] + "</td>")
 	 res = res.concat("<td>" + data.col_list[i] + "</td>");

 	 console.log(' row col_list '+ i +": "+ JSON.stringify(data.col_list[i]));
    }

// 	 res = res.concat("</tr>");

 	 return res;
  }; // showTable
 */






