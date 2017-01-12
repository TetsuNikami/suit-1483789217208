// ui_model.js ブラウザUI用 JavaScript (index.htmlより呼ばれる)

var currentUC = "オーダーエントリーUC";		// Current Use Case
console.log('ui_model.js init, getDBList ' + currentUC);

var itemLimit = 50;


/*
function getColumnRow() {

var row = {};
//currentDB = decodeURI( window.location.search.substring( 1 ) );
console.log('getColmnRow() currentDB param: ' + currentUC);

	var param = {};
param.dbeaz_id = currentUC;
console.log("getColumnRow() dbeaz_id: " + currentUC);
var res = "";
var res2 = "";

if (currentUC!="") {
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

      		var columns = "<th>データ項目名</th><th>属性</th><th>長さ</th>");


//       		res = makeColumns(row);

        	 $("#viewTable").append("<thead>"+ columns +"</thead>" );
        	 $("#viewTable").append("<tfoot>"+ columns +"</tfoot>" );

        	 // .DataTable() でid=viewTable のtableに、jQuery DataTableを割り当てる
        	 var currentDataTable = $('#viewTable').DataTable(
        			 { bAutoWidth : false, aLengthMenu : [25,50,100,200], bProcessing : true });

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

} // function getColumnRow
*/

function getDataItems(currentDataTable) {
//	var columns = "<th>エンティティ</th><th>データ項目名</th><th>属性</th><th>長</th>";
	var columns = "<th>データ項目名</th><th>属性</th><th>長</th>";

	 $("#viewTable").append("<thead>"+ columns +"</thead>" );
	 $("#viewTable").append("<tfoot>"+ columns +"</tfoot>" );

	 var currentDataTable = $('#viewTable').DataTable(
			 { bAutoWidth : false, aLengthMenu : [20,50,100,200], bProcessing : true });

	var param = {};
	console.log("ui_model.js - getDataItems() ");

  	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /getAll呼び出し
  	$.ajax({
  		type: 'POST',
  		data: JSON.stringify(param),
  		contentType: 'application/json',
  		url: '/getDataItems',						// index.js getDataItems call
  		success: function(rows) {
  			for(var i=0; i<rows.length; i++) {		// error?
//        	var list = [ rows[i].data_entity, '<input type=checkbox name=chk onchange=onCheck() value='+rows[i].uuid+'>'+ rows[i].data_item ,
//           var list = [ rows[i].data_entity, '<input type=checkbox name=chk onchange=onCheck() value=100>100',
//  				var list = [ rows[i].data_entity, '<input type=checkbox name=chk'+i+' onclick=onCheck() value='+rows[i].data_item+'>'+ rows[i].data_item,
//  				var list = [ rows[i].data_entity, '<input type=button name=chk onclick=onCheck() value='+rows[i].data_item+'>'+ rows[i].data_item,
  				var data_name = rows[i].data_entity+"_"+rows[i].data_item;
  				var list = [ '<input type=checkbox id=d'+i+' onclick=onCheck('+i+',\"'+data_name+'\") value=d'+i+'>'+ data_name,
  				             rows[i].data_type, rows[i].data_length ];
          		console.log('ui_model.js getDataItems item: '+ JSON.stringify(list) );

        	currentDataTable.row.add(list).draw();


           	//        	currentDataTable.row.add( list.concat( rows[i].data_type+"("+rows[i].data_length+")" ) ).draw();

//        	currentDataTable.row.add( list.concat( rows[i].col_list ) ).draw();
           } // for

  		}, // success
           error:  function(data) { console.log('error getDocs: ' + JSON.stringify(data)); }
   }); // $.ajax
}


function onCheck(i, item) {
	 console.log('ui_model.js onCheck selected: ' + i + ' - ' + item + ' - ' +  document.getElementById("d"+i).checked);

	 var pos = item.indexOf("_");
	 var data_name = ""

	 if(pos>0) data_name = item.substr(pos+1);

	 if (document.getElementById("d"+i).checked) {  // checked = true
//		 $("#sortable").append("<li class=\"ui-state-default\">"+data_name+" <input type=text size=15 maxlength=15></li>");
		 $("#sortable").append("<li class=i"+i+">"+data_name+" <input type=text size=15 maxlength=15></li>");
	 } else {  // not checked
		 $(".i"+i).remove();
	 }


}




// 初期画面の表示で、POSTでindex.jsのgetDBListをコールしDB List取得、SELECTリストに表示
/*
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
*/


