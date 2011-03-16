var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js','./charity_data.js');
(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	cc.getDataRow=function(charityItem,countItem){
		var row = Ti.UI.createTableViewRow({
			height:120,
			hasChild:true,
			className:'charity_' + countItem,  //Add unique to force new template
			charity_name:charityItem.name,
			web_link:charityItem.web,
			phone_num:charityItem.phone_num,
			phone_text:charityItem.phone,
			address:charityItem.address,
			info_text:charityItem.info_text,
			charity_logo:charityItem.logo,
			isRowElement:true //hack for android touch event
		});
		
		var vwRow = Ti.UI.createView({
				width:(Ti.Platform.displayCaps.platformWidth-20),
				id:'vwRow'
		});


		var vwCol1 = Ti.UI.createView({id:'vwCol1'});
		vwRow.add(vwCol1);	
		
		var vwCol2 = Ti.UI.createView({id:'vwCol2'});	
		vwRow.add(vwCol2);
		
		var logoImg = Ti.UI.createImageView({
		    image:charityItem.logo,
		  	preventDefaultImage:true,
			height:75,
			width:75
	    });
		vwCol1.add(logoImg);
			
		var charityName = Ti.UI.createLabel({text:charityItem.name, id:'charityName'});		
		vwCol2.add(charityName);				
		row.add(vwRow);
		return 	row;
	};

	cc.getTableData=function(){
		var tableData =[];
		var itemCount = cc.charityData.orgInfo.length;
		for (var iLoop=0;iLoop<itemCount;iLoop++){
			tableData.push(cc.getDataRow(cc.charityData.orgInfo[iLoop],iLoop));
		}
		return tableData;
	};
	
	cc.tableView = Ti.UI.createTableView({
		backgroundColor:'#fff',
		data:cc.getTableData()
	});
	cc.win.add(cc.tableView);	
})();
		

//-------------------------------
//	Events
//-------------------------------
cc.tableView.addEventListener('click', function(e){

	var wPage = Ti.UI.createWindow({  
	    barColor:cc.win.barColor,
		navBarHidden:false,
		title:Ti.Locale.getString('contribute_detail_title'),
		backgroundImage:'../images/backgrounds/BG_map_gray.png',
		url:'contribute_detail.js',
		backButtonTitleImage:'../images/icon_arrow_left.png',
		charity_name:e.rowData.charity_name,
		web_link:e.rowData.web_link,
		phone_num:e.rowData.phone_num,
		phone_text:e.rowData.phone_text,
		charity_address:e.rowData.address,
		info_text:e.rowData.info_text,
		charity_logo:e.rowData.charity_logo
	});
	
	Ti.UI.currentTab.open(wPage,{animated:true});	
});