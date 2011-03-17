var cc ={win:Ti.UI.currentWindow};
Ti.include('./keys.js','./application.js');

(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];

	
	cc.refreshButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.REFRESH});
		
	if(!isAndroid()){
		cc.win.rightNavButton=cc.refreshButton;	
	}

	Ti.App.fireEvent('show_indicator');

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "news.json");
	if(!file.exists()) {
	   file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "data/news.json");
	}

	var tableData = JSON.parse(''+file.read());

	var template = {
	    selectedBackgroundColor: '#000',
	    backgroundColor: '#000',
	    rowHeight: 100,
	    layout: [
	        {type:'image', left:10, top:5, width:50, height:50, name:'photo'},
	        {type:'text', fontSize:16, fontWeight:'bold', fontFamily:'Arial', left:70, top:2, width:200, height:30, color:'#000000', name:'user'},
	        {type:'image', right:5, top:35, width:36, height:34, name:'button'}
	   ]
	};

	cc.tableView = Ti.UI.createTableView({
	    data: tableData,
	    template: template
	});

	cc.win.add(cc.tableView);
	
	cc.refeshItemsList=function(){
		alert("Downloading feed from server");
	};
	
	Ti.App.fireEvent('hide_indicator');
})();

// Create tableView row event listener
cc.tableView.addEventListener('click', function (e) {
    if (e.rowData.controller) {
        var win = Titanium.UI.createWindow({
            url:e.rowData.controller,
			rss_url:e.rowData.rss,
            title:e.rowData.title,
		    barColor:cc.win.barColor,
		    fullscreen:false,
			backgroundImage:'../images/backgrounds/BG_map_gray.png',
			backButtonTitleImage:'../images/icon_arrow_left.png'
        });

        Ti.UI.currentTab.open(win,{animated:true});
    }
});

Ti.App.addEventListener('update_news', function() {
    var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "news.json");
    var data = JSON.parse(''+file.read());
    tableView.setData(data);
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
