// ui_model.js ブラウザUI用 JavaScript (index.htmlより呼ばれる)

var currentUC = "オーダーエントリーUC";		// Current Use Case
console.log('ui_model.js init, getDBList ' + currentUC);

var itemLimit = 50;


function getDataItems(currentDataTable) {
//	var columns = "<th>エンティティ</th><th>データ項目名</th><th>属性</th><th>長</th>";
	var columns = "<th>データ項目名</th><th>属性</th><th>長</th>";

	 $("#viewTable").append("<thead>"+ columns +"</thead>" );
	 $("#viewTable").append("<tfoot>"+ columns +"</tfoot>" );

	 var currentDataTable = $('#viewTable').DataTable(
			 { bAutoWidth : false, aLengthMenu : [15,20,30,50], bProcessing : true });

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
  				var data_name = rows[i].data_entity+"_"+rows[i].data_item;
  				var list = [ '<input type=checkbox id=d'+i+' onclick=onCheck('+i+',\"'+data_name+'\",'+rows[i].data_length+') value=d'+i+'>'+ data_name,
  				             rows[i].data_type, rows[i].data_length ];
          		console.log('ui_model.js getDataItems item: '+ JSON.stringify(list) );

        	currentDataTable.row.add(list).draw();
           	//        	currentDataTable.row.add( list.concat( rows[i].data_type+"("+rows[i].data_length+")" ) ).draw();
           } // for

  		}, // success
           error:  function(data) { console.log('error getDocs: ' + JSON.stringify(data)); }
   }); // $.ajax
}


function onCheck(i, item, len) {
	 console.log('ui_model.js onCheck selected: ' + i + ' - ' + item + ' - '+ len + ' - ' +  document.getElementById("d"+i).checked);

	 var pos = item.indexOf("_");
	 var data_name = ""

	 data_name = item.substr(pos+1);
	 console.log("ui_model.js - onCheck(): "+data_name+", len: "+len);


	 if (document.getElementById("d"+i).checked) {  // checked = true
		 if (item.substr(0,1)=="_")
			 $("#sortable").append("<font color=#888><li class=i"+i+">"+data_name+"</li></font>");
		 else
			 $("#sortable").append("<li class=i"+i+">"+data_name+" <input type=text size="+len+" maxlength="+len+"></li>");

//		 $("#sortable").append("<li class=\"ui-state-default\">"+data_name+" <input type=text size=15 maxlength=15></li>");
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


