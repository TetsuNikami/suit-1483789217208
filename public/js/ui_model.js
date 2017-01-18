// ui_model.js ブラウザUI用 JavaScript (index.htmlより呼ばれる)

var currentUC = "オーダーエントリーUC";		// Current Use Case
console.log('ui_model.js init, getDBList ' + currentUC);

var itemLimit = 50;
var ui_canvas_width = 800;
var ui_item_width = ui_canvas_width-300;


function getDataItems(currentDataTable) {
//	var columns = "<th>エンティティ</th><th>データ項目名</th><th>属性</th><th>長</th>";
	var columns = "<th>データ項目名</th><th>属性</th><th>長</th>";

	 $("#viewTable").append("<thead>"+ columns +"</thead>" );
	 $("#viewTable").append("<tfoot>"+ columns +"</tfoot>" );

	 var currentDataTable = $('#viewTable').DataTable(
			 { bAutoWidth : false, aLengthMenu : [13,20,30,50], bProcessing : true });

	// tableCanvas -- tentative in here
	 $("#botTable").append("<thead><th>カラム1</th><th>カラム2</th><th>カラム3</th><th>カラム4</th></thead>" );
	 var bottomTable = $('#botTable').DataTable(
	 		 { bAutoWidth : false, aLengthMenu : [10,20,30,50], bProcessing : false });


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
          		//console.log('ui_model.js getDataItems item: '+ JSON.stringify(list) );

        	currentDataTable.row.add(list).draw();
           	//        	currentDataTable.row.add( list.concat( rows[i].data_type+"("+rows[i].data_length+")" ) ).draw();
           } // for

  		}, // success
           error:  function(data) { console.log('error getDocs: ' + JSON.stringify(data)); }
   }); // $.ajax
}


//When Data item is checked in left data_item list
function onCheck(i, item, len) {
	 //console.log('ui_model.js onCheck selected: ' + i + ' - ' + item + ' - '+ len + ' - ' +  document.getElementById("d"+i).checked);

	 var pos = item.indexOf("_");
	 var data_name = ""

	 data_name = item.substr(pos+1);

	 if (uiDataItems!="")  uiDataItems = uiDataItems + "," + item;
	 else 					uiDataItems = item;
	 console.log("ui_model.js - onCheck(): "+uiDataItems+" len: "+len);


	 if (document.getElementById("d"+i).checked) {  // checked = true
		 if (item.substr(0,1)=="_") // blank etc.
			 $("#sortable").append("<font color=#ccc><li class=i"+i+" id="+item+">"+data_name+"</li></font>");
		 else
			 $("#sortable").append("<li class=i"+i+" id="+item+">"+data_name+" <input type=text size="+len+" maxlength="+len+"></li>");

		 $("#sortable li").css("width", ui_item_width);

//		 $("#sortable").append("<li class=\"ui-state-default\">"+data_name+" <input type=text size=15 maxlength=15></li>");
	 } else {  // not checked
		 $(".i"+i).remove();
	 }


}

// When Number od column is changed in screen_view bar
function changeScreenCol() {

	if (document.screen_view.select_screen_col.value == "scr_col1")
		ui_item_width = ui_canvas_width-300;
	else if (document.screen_view.select_screen_col.value == "scr_col2")
		ui_item_width = Math.floor( (ui_canvas_width-200)/2 );
	else if (document.screen_view.select_screen_col.value == "scr_col3")
		ui_item_width = Math.floor( (ui_canvas_width-100)/3 );
	else if (document.screen_view.select_screen_col.value == "scr_col4")
		ui_item_width = Math.floor( (ui_canvas_width-50)/4 );

	 $("#sortable li").css("width", ui_item_width);

	 console.log("ui_model.js - changeScreenCol(): li_width = "+ui_item_width+" - "+document.screen_view.select_screen_col.value);
}


//When Save button is clicked in screen_view bar
function saveLayout() {
	var param = {};
	param.screen = "商品受注登録画面";
	param.items = 	uiDataItems

	console.log("ui_model.js - saveLayout(): "+param.items);

/*
	$( "#sortable" ) . sortable( {
        update: function( event, ui ) {
            param.items = $( "#sortable" ) . sortable( "toArray" ) . join( "," );
	       	console.log("ui_model.js - saveLayout(): "+param.items);
        }
    } );
*/

  	// POSTでのajaxコールで、サーバーのapp.jsのapp.post /getAll呼び出し
  	$.ajax({
  		type: 'POST',
  		data: JSON.stringify(param),
  		contentType: 'application/json',
  		url: '/postUIDataItems',						// index.js getDataItems call
  		success: function(row) {
	       	 console.log("ui_model.js - saveLayout() retun: "+row);
  		}, // success
           error:  function(data) { console.log('error ui_model.js - saveLayout(): ' + row); }
   }); // $.ajax


	 $("#statusLine").append("Saved \""+uiDataItems+"\" to [商品受注登録画面] <br>");
  	window.status = "Saved "+uiDataItems+" to [商品受注登録画面] ";
}


//When Add DataItem button is clicked in screen_view bar
function addUIDataItem() {


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


