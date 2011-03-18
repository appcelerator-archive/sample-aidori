var cc ={win:Ti.UI.currentWindow};
Ti.include('./keys.js','./application.js');

(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
	Ti.App.fireEvent('show_indicator');

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "news.json");
	if(!file.exists()) {
	   file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "data/news.json");
	}

	var dataContent = JSON.parse(''+file.read());
	
	cc.getTableData=function(){
		var tableData=[];
		var itemCount = dataContent.length;
		for (var iLoop=0;iLoop<itemCount;iLoop++){
			tableData.push({title:dataContent[iLoop].title,
						    hasChild:true,
						    color:'#000',
						  	backgroundColor:'#fff',
						    height:'auto',
						    controller:dataContent[iLoop].controller,
						    rss:dataContent[iLoop].rss
				});
		}
		
		return tableData;
	};

	cc.tableView = Ti.UI.createTableView({
	    data: cc.getTableData()
	});

	cc.win.add(cc.tableView);
	
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
			backgroundColor:'#f39380',
			backButtonTitleImage:'../images/icon_arrow_left.png'
        });

        Ti.UI.currentTab.open(win,{animated:true});
    }
});

Ti.App.addEventListener('update_news', function() {
    var file = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "news.json");
    var data = JSON.parse(''+file.read());
    cc.tableView.setData(data);
});