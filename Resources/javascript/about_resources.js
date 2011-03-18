var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js','./about_resources_data.js');
(function(){

	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
	Ti.API.info('currentCountry=' +  Ti.Locale.currentCountry);
	Ti.API.info('currentLanguage=' +  Ti.Locale.currentLanguage);
	Ti.API.info('currentLocale=' +  Ti.Locale.currentLocale);	

	cc.getDataRowHeader=function(itemR,itemCount){
		var row = Ti.UI.createTableViewRow({
			height:20,
			hasChild:false,
			className:'header_' + itemCount,  //Add unique to force new template
			allowClick:false,
			backgroundColor: '#666',
			isRowElement:true //hack for android touch event
		});
		
		var resName = Ti.UI.createLabel({text:Ti.Locale.getString(itemR.header), 
											 color:'#fff',
											 height:'auto',
											 left:5,
											 width:(Ti.Platform.displayCaps.platformWidth-20),
											 textAlign:'left',
											 font:{
												fontSize:16,fontWeight:'Bold'
											}
											});	
		row.add(resName);
		
		return row;
	};				
	cc.getDataRow=function(itemR,itemCount){
		var row = Ti.UI.createTableViewRow({
			height:50,
			hasChild:true,
			className:'res_' + itemCount,  //Add unique to force new template
			ja_url:itemR.ref_ja_url,
			en_url:itemR.ref_en_url,
			allowClick:true,
			isRowElement:true //hack for android touch event
		});
		
		var resName = Ti.UI.createLabel({text:Ti.Locale.getString(itemR.title), 
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
			if(cc.resourceData[iLoop].hasHeader){
				tableData.push(cc.getDataRowHeader(cc.resourceData[iLoop],iLoop));
			}
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
	//Stop them from clicking on headers
	if(!e.rowData.allowClick){
		return;
	}
	//If japan then try to load the japanese link first
	if(Ti.Locale.currentLanguage=='ja'){
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