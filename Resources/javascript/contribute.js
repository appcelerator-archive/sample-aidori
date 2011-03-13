
Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};

cc.tableView = Ti.UI.createTableView({
	backgroundColor:'#fff'
});
cc.win.add(cc.tableView);

Ti.API.info('Hopfully it shows up');