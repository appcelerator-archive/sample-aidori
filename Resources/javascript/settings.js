Titanium.include('./application.js');

var win = Ti.UI.currentWindow;
var properties = Titanium.App.Properties;
var data = [];
var orgField;

function buildRows() {
  data[0] = Ti.UI.createTableViewSection({headerTitle:'Organization Information'});
	
	var orgRow = Ti.UI.createTableViewRow({height:50});
	if(Ti.Platform.name != 'android') {
  	orgRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	}
	orgRow.className = 'control';
	
	var orgLabel = Ti.UI.createLabel({
  	color:(Ti.Platform.name == "android" ? '#fff' : '#444'),
  	font:{fontSize:14, fontWeight:'bold'},
  	text:"Organization ID",
  	top:16,
  	left:10,
  	width:130,
  	height:16,
  	textAlign:'left'
  });
  orgRow.add(orgLabel);
  
	orgField = Titanium.UI.createTextField({
		color:'#000',
		value:(properties.hasProperty("orgPin") ? properties.getString("orgPin") : ''),
  	hintText:'Optional ID',
		autocorrect:false,
		height:(Ti.Platform.name == "android" ? 40 : 30),
		top:9,
		left:130,
		width:(Ti.Platform.name == "android" ? 164 : 154),
  	font:{fontSize:14, fontWeight:'normal'},
		clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
	});	
	orgRow.add(orgField);
	
	
	data[0].add(orgRow);
	
}

buildRows();

// create table view data object
var tableView = Ti.UI.createTableView({
	data:data, 	
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

win.add(tableView);

var saveButton = Titanium.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.SAVE});
saveButton.addEventListener('click',function(){
  saveSettings();

});
win.setRightNavButton(saveButton);


if(Ti.Platform.name == "android") {
  var menu = Ti.UI.Android.OptionMenu.createMenu();
  var saveItem = Ti.UI.Android.OptionMenu.createMenuItem({
      title : 'Save Settings'
  });
  saveItem.addEventListener('click', function(){
    saveSettings();
  });

  menu.add(saveItem);
  Ti.UI.Android.OptionMenu.setMenu(menu); 
}

function saveSettings() {
  properties.setString('orgPin',orgField.value);

  var alert = Titanium.UI.createAlertDialog({
  	title:'Saved!',
  	message:'Your organization ID has been saved.  This will be sent with each report.'
  });
  alert.show();   
}