var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js','./about_resources_data.js');
(function(){

	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
				
	cc.getDataRow=function(itemR,itemCount){
		var row = Ti.UI.createTableViewRow({
			height:50,
			hasChild:true,
			className:'res_' + itemCount,  //Add unique to force new template
			ja_url:itemR.ref_ja_url,
			en_url:itemR.ref_en_url,
			isRowElement:true //hack for android touch event
		});
		
		if(itemR.hasHeader){
			row.header=itemR.header;
		}
		var resName = Ti.UI.createLabel({text:itemR.title, 
											 color:'#000',
											 height:'auto',
											 left:5,
											 width:(Ti.Platform.displayCaps.platformWidth-20),
											 textAlign:'left',
											 font:{
												fontSize:14,fontWeight:'Bold'
											}
											});	
		row.add(resName);
		
		return row;
	};
	
	cc.getTableData=function(){
		var tableData=[];
		var itemCount = cc.resourceData.length;
		for (var iLoop=0;iLoop<itemCount;iLoop++){
			tableData.push(cc.getDataRow(cc.resourceData[iLoop],iLoop));
		}
		return tableData;
	};
	cc.tableView = Ti.UI.createTableView({
		backgroundColor:'#fff',
		data:cc.getTableData()
	});
	cc.win.add(cc.tableView);
	
	cc.openLink=function(urlText){
		if (!Ti.Network.online){
		 	  noNetworkAlert();
		} else {
		   Ti.Platform.openURL(urlText);
		}		
	};
})();


//-------------------------------
//	Events
//-------------------------------
cc.tableView.addEventListener('click', function(e){

	//If japan then try to load the japanese link first
	if(Ti.Locale.currentCountry=='ja'){
		if(e.rowData.ja_url.length>0){
			cc.openLink(e.rowData.ja_url);
		}else{
			cc.openLink(e.rowData.en_url);
		}
	}else{
		//For everyone else try the english version first
		if(e.rowData.en_url.length>0){
			cc.openLink(e.rowData.en_url);
		}else{
			cc.openLink(e.rowData.ja_url);
		}		
	}
});