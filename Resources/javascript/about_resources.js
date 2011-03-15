var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js','./about_resources_data.js');
(function(){

	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
				
	cc.buildRow=function(){
		
	};
	
	cc.getTableData=function(){
		var tableData=[];
		tableData=cc.resourceData;
		return tableData;
	};
	cc.tableView = Ti.UI.createTableView({
		backgroundColor:'#fff',
		data:cc.getTableData()
	});
	cc.win.add(cc.tableView);
})();