var types = {}; // object for saving some types of goods
var goods, kind; // declare some variables
var tableArr = []; // declare empty array for adding some objects 

$(document).ready(function() {
	
	// ---------- handling the first select ----------

	// create a handler function 'getSelect' that takes selected fields  	
	function getSelect() {
		goods = $("#selectGoods :selected").html();
		kind = $("#selectKind :selected").html();
		model = $("#selectModel :selected").html();
	}	
	
	// sending the ajax request
	var ajaxRead = $.ajax({
		type: 'GET',
		url: 'http://www.mocky.io/v2/571662fa110000521d87da7f',
		dataType: 'jsonp',
		crossDomain: true
	});
  
  	// show a message in case the request isn't successful
	ajaxRead.fail(function(data) {
		alert(data);
	});
	
	// if the request is successful
	ajaxRead.done(function(data) {
		// loop through an array 'data'
		for ( var i = 0; i < data.length; i++ ) {
			var type = data[i].type;
			types[type] = type;
		}
		
		// generate some tags 'option' in the first select
		for ( var prop in types ) {
			$('#selectGoods').append('<option value="' + types[prop] + '">' + types[prop] + '</option>');
		}
	});
  
  	// ---------- handling the second select ----------
  
  	$('#selectGoods').change(function() {
  		
	  	$("#selectKind").not('option:selected').empty(); // clear the second select
	  	
	  	ajaxRead.done(function(data) {
	  			
		getSelect(); // invoke the function 'getSelect'
			
		var arrNames = []; // declare empty array
		
			// loop through an array 'data'
	     	for ( var j = 0; j < data.length; j++ ) {
	     			
	     		var flag = false; // declare the variable 'flag' to show that there isn't so variable in the array 'arrNames'
	     		
	     			// if the variable 'goods' matches with the 'data[i].type'
					if ( goods == data[j].type ) { // look for the match 
					
						// loop through an array 'arrNames'
						for ( var k = 0; k < arrNames.length; k++ ) {
							
							if( arrNames[k] == data[j].name ) {
								
								flag = true; // change the variable 'flag' if the match is found and exit from the loop
								break; 
							}
						}
						
					if( !flag )	{
						arrNames.push(data[j].name); // add the object to the array 'arrNames'
					}	
				}
			}
			
		// add default option to second select		
		$('#selectKind').append('<option value="none">Выберите марку</option>');
		
		// generate some tags 'option' in the second select
			for ( var n = 0; n < arrNames.length; n++ ) {
				$('#selectKind').append('<option value="' + arrNames[n] + '">' + arrNames[n] + '</option>');
			}
	  	});
	});


	// ---------- handling the third select ----------
	
	$('#selectKind').change(function(){ 
	
		$("#selectModel").not('option:selected').empty(); // clear the third select 
	
		ajaxRead.done(function(data) {
		
		getSelect(); // invoke the function 'getSelect'
				
		var arrModels = []; // declare empty array
		
			// loop through an array 'data'
			for ( var i = 0; i < data.length; i++ ) {
		     			
		     	var flag = false; // declare the variable 'flag' to show that there isn't so variable in the array 'arrModels'
		     	
		     		// if the variable 'kind' matches with the 'data[i].name'	
					if ( kind == data[i].name ) {
						
						// loop through an array 'arrModels'
						for ( var k = 0; k < arrModels.length; k++ ) {
								
							if( arrModels[k] == data[i].model ) {
									
								flag = true; // change the variable 'flag' if the match is found and exit from the loop
								break; 
							}
						}
						
					if( !flag )	{
						arrModels.push(data[i].model); // add the object in the array 'arrModels'
					}	
				}
			}
			
		// add default option to third select	
		$('#selectModel').append('<option value="none">Выберите модель</option>');	
		
		// generate some tags 'option' in the third select
			for ( var n = 0; n < arrModels.length; n++ ) {
				$('#selectModel').append('<option value="' + arrModels[n] + '">' + arrModels[n] + '</option>');
			}
		});
	});
	
	// ---------- action by clicking the button 'Посмотреть' ----------
	
	$('#buttonDescription').click(function() {
		
		alert("");
		
 		var alert_text = '';
  		var alert_height = '';
  		
 		function alert(alert_text) {
			$("#alert_dialog").show(); // show the block with id = 'alert_dialog'
			$("#alert_text").text(alert_text);
			alert_height = $(document).height();
			$("#alert_fog").css('height', alert_height); // set the style the block with id = 'alert_fog' 
		}
		ajaxRead.done(function(data) {
		
			getSelect(); // invoke the function 'getSelect'
			
			// loop through an array 'data'
			for ( var i = 0; i < data.length; i++ ) { 
			
				// if the variables 'goods' and kind' match with the 'data[i].type' and 'data[i].name'
				if( goods == data[i].type && kind == data[i].name ) {
					
					// add selected values in some spans
			  		$('span#goods').html( data[i].type + " " + data[i].name + " " + data[i].model );
			  		$('span#parametrs').html( data[i].info );
			  		$('span#price').html( data[i].price );
				}
		  	}
  		});
  		
	  	$("#alert_close").click(function() {
	  		$("#alert_dialog").hide(); // hide the block with id = 'alert_dialog'
		});
		
	});
	
	// ---------- action by clicking the button 'Добавить в корзину' ----------
	
	$('#buttonAddBasket').click(function() {
		
		ajaxRead.done(function(data) {
		
		getSelect(); // invoke the function 'getSelect'
		
		var customerName = $('#customer').val(); // declare the variable 
		
		// loop through an array 'data'
		for ( var i = 0; i < data.length; i++ ) {
			
			if ( goods == data[i].type && kind == data[i].name && model == data[i].model ) {
				
				data[i].customer = customerName; // add a property 'customer' to the object data[i]
				tableArr.push(data[i]); // pushing the object to the array 'tableArr' 

				createTable(); // invoke the function 'createTable'
			}
		}

		});
	});

	// ---------- action by clicking the button 'Оплатить' ----------
	
	$('#buttonPay').click(function(){
		
		var jsonToServer = JSON.stringify(tableArr); // to convert the array 'tableArr' to a string in JSON format
	
		alert("");
		
 		var alert_text = '';
  		var alert_height = '';
  		
 		function alert(alert_text) {
			$("#alert_dialog2").show();
			$("#alert_text").text(alert_text);
			alert_height = $(document).height();
			$("#alert_fog2").css('height', alert_height);  
		}
		// show the message if the array 'tableArr' is empty
	  	if ( tableArr.length == 0 ) {
	  		$('span#infoToServer').html("Нам очень жаль! Вы ничего не добавили в корзину");
	  		
	  	// show the total information that will be sent on the server	
	  	} else {
	  		$('span#infoToServer').html( jsonToServer );
	  	}
		
	  	$("#alert_close2").click(function(){
	  		$("#alert_dialog2").hide();
		});
	
	});
	
	/* action by clicking the button 'Поиск',
	   using a plugin jquery 'Tiny jQuery Plugin For Clint-side Table Filtering - filterForTable'
	*/ 
	
	$('#livesearch').on("keyup", function() { 
		
		$('input#livesearch').liveSearch({
			table: 'table.table-hover'
		});
		
	});
	
});

// create a handler function 'createTable' that designs the table of the order
function createTable() {
	var str = "<table class='table table-hover'><thead><tr><th>Тип товара</th><th>Наименование</th><th>Модель</th><th>Цена</th><th>Заказчик</th></tr></thead><tbody>";
	
	// loop through an array 'tableArr'
		for( var i = 0; i < tableArr.length; i++ ) { 
			str+= "<tr>";	
			
			str+="<td>"+tableArr[i].type+"</td>"+"<td>"+tableArr[i].name+"</td>"+"<td>"+tableArr[i].model+"</td>"+"<td>"+tableArr[i].price+"</td>"+"<td>"+tableArr[i].customer+"</td>";
		
			str+="</tr>";
		}
			str+= "</tbody></table>";
				
			$('#table').html(str);
			$('.showTable').show();
}