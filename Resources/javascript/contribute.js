var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js');

// load charity data
var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "contribute.json");
if(!file.exists()) {
   file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "data/contribute.json");
}

cc.charityData = JSON.parse(''+file.read());

(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
	cc.refreshButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.REFRESH});
		
	if(!isAndroid()){
		cc.win.rightNavButton=cc.refreshButton;	
	}
	
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
			defaultImage:'../images/cont_placeholder.png',
			height:75,
			width:75,
			canScale:false
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

	cc.refeshItemsList=function(){
		alert("Downloading feed from server");
	};
})();


//-------------------------------
//	Events
//-------------------------------
Ti.App.addEventListener('update_contribute', function() {
    var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "contribute.json");
    cc.charityData = JSON.parse(file.read());
    cc.tableView.setData(cc.getTableData());
});

cc.tableView.addEventListener('click', function(e){

	var wPage = Ti.UI.createWindow({  
	    barColor:cc.win.barColor,
		navBarHidden:false,
		title:Ti.Locale.getString('contribute_detail_title'),
		backgroundColor:'#f39380',
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

cc.refreshButton.addEventListener('click', function(e){
	if (!Ti.Network.online){
	 	  noNetworkAlert();
	}else{
		cc.refeshItemsList();
	}
});

if(isAndroid()){
	Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;

		var mRefresh = menu.add({title: Ti.Locale.getString('refresh_list') });
		mRefresh.setIcon('../images/color_refresh.png');
	    mRefresh.addEventListener("click", function(e) {
			cc.refeshItemsList();
	    });
	};
}
