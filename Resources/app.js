Titanium.include('javascript/application.js');
var indicatorShowing = false;

var tabGroup = Titanium.UI.createTabGroup();
var reportWin = Titanium.UI.createWindow({  
  url:'javascript/report.js',
  barColor:"#333",
  backgroundImage:'images/back.png',
  titleid:L('crisis_title')
});
var reportTab = Titanium.UI.createTab({  
  icon:'images/icon_report.png',
  title:'Report',
  window:reportWin
});

var twitterWin = Titanium.UI.createWindow({  
  url:'javascript/twitter.js',
  titleid:L('title_twitter'),
  barColor:"#333",
  backgroundColor:'#5a5c64'
});
var twitterTab = Titanium.UI.createTab({  
  icon:'images/icon_twitter2.png',
  title:L('tab_twitter'),
  window:twitterWin
});

var volunteerWin = Titanium.UI.createWindow({  
  url:'javascript/volunteer.js',
  backgroundImage:'images/back.png',
  title:L('title_volunteer'),
  barColor:"#333",
  backTitle:'Back'
});
var volunteerTab = Titanium.UI.createTab({  
  icon:'images/icon_volunteer.png',
  title:L('tab_volunteer'),
  window:volunteerWin
});

var aboutWin = Titanium.UI.createWindow({  
  url:'javascript/about.js',
  backgroundColor:'#000',
  title:L('title_about'),
  barColor:"#333",
  backTitle:'Back'
});
var aboutTab = Titanium.UI.createTab({  
  icon:'images/icon_about.png',
  title:L('tab_about'),
  window:aboutWin
});

tabGroup.addTab(reportTab);  
tabGroup.addTab(twitterTab);  
tabGroup.addTab(volunteerTab);  
tabGroup.addTab(aboutTab);  

var disclaimerTabGroup = Titanium.UI.createTabGroup();
var disclaimerWin = Titanium.UI.createWindow({
  url:'javascript/disclaimer.js',
  backgroundColor:'#476e8b',
  title:L('disclaimer'),
  barColor:"#333",
  backTitle:'Close',
  tabBarHidden:true
});
var disclaimerTab = Titanium.UI.createTab({  
  title:L('disclaimer'),
  window:disclaimerWin
});
disclaimerTabGroup.addTab(disclaimerTab);

Ti.App.addEventListener('remove_disclaimer', function() {
  if (Titanium.Platform.name == 'android') {
    disclaimerWin.close();
  } else {
    disclaimerTabGroup.close();
  }
  Ti.App.Properties.setBool('disclaimerViewed', true);
  tabGroup.open();
});

//if (Ti.App.Properties.hasProperty('disclaimerViewed')) {
//  tabGroup.open();
//} else {
//  if (Titanium.Platform.name == 'android') {
//    disclaimerWin.open();
//  } else {
    disclaimerTabGroup.open();
//  }
//}


// ---------------------------------------------------------------
// Create custom loading indicator
// ---------------------------------------------------------------
var indWin = null;
var actInd = null;
function showIndicator(title) {
	indicatorShowing = true;
  Ti.API.info("showIndicator with title " + title);
	
  	// window container
  	indWin = Titanium.UI.createWindow({
  		height:150,
  		width:150
  	});

  	// black view
  	var indView = Titanium.UI.createView({
  		height:150,
  		width:150,
  		backgroundColor:'#000',
  		borderRadius:10,
  		opacity:0.7
  	});
  	indWin.add(indView);

  	// loading indicator
  	actInd = Titanium.UI.createActivityIndicator({
  		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
  		height:30,
  		width:30
  	});
  	indWin.add(actInd);

  	// message
  	var message = Titanium.UI.createLabel({
  		text:title,
  		color:'#fff',
  		width:'auto',
  		height:'auto',
  		font:{fontSize:20,fontWeight:'bold'},
  		bottom:20
  	});
  	indWin.add(message);
  	indWin.open();
  	actInd.show();
};

function hideIndicator() {
  	actInd.hide();
  	indWin.close({opacity:0,duration:500});
  	indicatorShowing = false;
};

// ---------------------------------------------------------------
// Add global event handlers to hide/show custom indicator
// ---------------------------------------------------------------
Titanium.App.addEventListener('show_indicator', function(e) {
  if(Ti.Platform.name == 'android') {
    return;
  }
  
  if(e.title == null) { e.title = 'Loading'; }
  if(indicatorShowing == true) { hideIndicator(); }
	showIndicator(e.title);
});
Titanium.App.addEventListener('change_title', function(e) {
  if(e.title) {
    hideIndicator();
  	showIndicator(e.title);
  }
});
Titanium.App.addEventListener('hide_indicator', function(e) {
	hideIndicator();
});
