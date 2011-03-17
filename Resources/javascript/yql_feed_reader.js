var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js');

(function(){
	Ti.App.fireEvent('show_indicator');
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
	cc.tableView = Ti.UI.createTableView({
		backgroundColor:'#fff'
	});
	cc.win.add(cc.tableView);
	
	cc.getDataRow=function(article,countItem){
		var row = Ti.UI.createTableViewRow({
			height:120,
			hasChild:true,
			className:'article_' + countItem,  //Add unique to force new template
			web_link:article.link,
			isRowElement:true //hack for android touch event
		});
		
		var vwRow = Ti.UI.createView({
				width:(Ti.Platform.displayCaps.platformWidth-20),
				id:'vwRow'
		});
					
		var articleTitle = Ti.UI.createLabel({
			text:article.title, 
			color:'#000',
			left:5,
			right:5,
			top:0,
			bottom:0
			});	
								
		vwRow.add(articleTitle);
		row.add(vwRow);
		return 	row;
	};

		
	if (!Ti.Network.online){
	 	  noNetworkAlert();
	}else{
		Ti.Yahoo.yql('select title, link from rss where url="'+ cc.win.rss_url + '"',function(e){
//		Ti.API.info('e.success=' + e.success);
//			Ti.API.info('yql results='  + JSON.stringify(e.data));
			var tableData=[];

			if((isAndroid()&&e.data==null)||
			(!isAndroid()&(e.data==null||!e.success))){
				Ti.App.fireEvent('hide_indicator');
			  	Ti.UI.createAlertDialog({
			  	  title:Ti.Locale.getString('new_reader_error_title'),
			  	  message:Ti.Locale.getString('new_reader_error_msg')
			  	}).show();
				return;
			}
			var itemCount = e.data.item.length;

			for (var iLoop=0;iLoop<itemCount;iLoop++){
				tableData.push(cc.getDataRow(e.data.item[iLoop],iLoop));
			}	

			cc.tableView.setData(tableData);		
			Ti.App.fireEvent('hide_indicator');
		});
	}
})();

cc.tableView.addEventListener('click', function (e) {
  	if (!Ti.Network.online){
	 	  noNetworkAlert();
		  return;
	}
  	if (e.rowData.web_link.length>0) {
		Ti.Platform.openURL(e.rowData.web_link);
    }
});