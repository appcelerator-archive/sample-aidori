var win = Ti.UI.currentWindow;
var isAndroid = Ti.Platform.osname == 'android';

var titleFont = {fontSize:16, fontWeight:'bold'};
var contentFont = {fontSize:16};

var nameRow = Ti.UI.createTableViewRow({height:50});
var nameTitle = Ti.UI.createLabel({
	text:L('facility_name'),
	font:titleFont,
	color:'#000000',
	textAlign:'right',
	width:70,
	left:0
});
nameRow.add(nameTitle);
var nameContent = Ti.UI.createLabel({
	text:win.prop.title,
	left:80,
	right:10,
	font:contentFont,
	color:'#000000'
});
nameRow.add(nameContent);

var addressRow = Ti.UI.createTableViewRow({height:80});
var addressTitle = Ti.UI.createLabel({
	text:L('map_address'),
	font:titleFont,
	color:'#000000',
	textAlign:'right',
	width:70,
	left:0
});
addressRow.add(addressTitle);
var addressContent = Ti.UI.createLabel({
	text:win.prop.detail,
	left:80,
	right:10,
	font:contentFont,
	color:'#000000'
});
addressRow.add(addressContent);

var tableView = Ti.UI.createTableView({
	data:[nameRow, addressRow],
	borderRadius:10,
	borderColor:'#666666',
	backgroundColor:'#ffffff',
	height:130,
	left:10,
	right:10,
	top:10
});

win.add(tableView);