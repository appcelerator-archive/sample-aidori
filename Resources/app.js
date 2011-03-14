Titanium.include('javascript/application.js');
var indicatorShowing = false;

var tabGroup = Ti.UI.createTabGroup();
var newsWin = Ti.UI.createWindow({  
  url:'javascript/news.js',
  barColor:"#333",
  backgroundImage:'images/back.png',
  titleid:L('crisis_title')
});
var newsTab = Titanium.UI.createTab({  
  icon:'images/icon_report.png',
  title:L('tab_news'),
  window:newsWin
});

var twitterWin = Titanium.UI.createWindow({  
  url:'javascript/twitter.js',
  titleid:L('title_twitter'),
  barColor:"#333",
  backgroundColor:'#5a5c64'
});

// Avoid keyboard overlapping the text fields
if (Ti.Platform.name == 'android') {
	twitterWin.windowSoftInputMode=Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE;
}

var twitterTab = Titanium.UI.createTab({  
  icon:'images/icon_twitter2.png',
  title:L('tab_twitter'),
  window:twitterWin
});

var contributeWin = Titanium.UI.createWindow({  
  url:'javascript/contribute.js',
  backgroundImage:'images/back.png',
  title:L('contribute_page_title'),
  barColor:"#333",
  backTitle:'Back'
});
var contributeTab = Titanium.UI.createTab({  
  icon:'images/icon_volunteer.png',
  title:L('tab_contribute'),
  window:contributeWin
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

var mapWin = Titanium.UI.createWindow({
	url:'javascript/map.js',
	backgroundColor:'#000',
	barColor:"#333",
	title:L('title_map')
});

var mapTab = Titanium.UI.createTab({
	icon:'images/light_pin@2x.png',
	title:L('tab_map'),
	window:mapWin
});

tabGroup.addTab(newsTab);  
tabGroup.addTab(twitterTab);  
tabGroup.addTab(contributeTab);  
tabGroup.addTab(mapTab);
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

if (Ti.App.Properties.hasProperty('disclaimerViewed')) {
  tabGroup.open();
} else {
  if (Titanium.Platform.name == 'android') {
    disclaimerWin.open();
  } else {
    disclaimerTabGroup.open();
  }
}


// ---------------------------------------------------------------
// Create custom loading indicator
// ---------------------------------------------------------------
var indWin = null;
var actInd = null;
function showIndicator(title) {
	indicatorShowing = true;
  Ti.API.info("showIndicator with title " + title);
	
  	// window container
  	indWin = Ti.UI.createWindow({
  		height:150,
  		width:150
  	});

  	// black view
  	var indView = Ti.UI.createView({
  		height:150,
  		width:150,
  		backgroundColor:'#000',
  		borderRadius:10,
  		opacity:0.7
  	});
  	indWin.add(indView);

  	// loading indicator
  	actInd = Ti.UI.createActivityIndicator({
  		style:Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
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


var droidActInd = Ti.UI.createActivityIndicator({height:30,width:30,message:'Loading...'});
function hideIndicator() {
	if(Ti.Platform.name == 'android'){
		droidActInd.hide();
	}else{
	  	actInd.hide();
	  	indWin.close({opacity:0,duration:500});
	  	indicatorShowing = false;		
	}
};

// ---------------------------------------------------------------
// Add global event handlers to hide/show custom indicator
// ---------------------------------------------------------------

Ti.App.addEventListener('show_indicator', function(e) {
  if(Ti.Platform.name == 'android') {
    droidActInd.show();
  }else{
	  if(e.title == null) { 
		 e.title = 'Loading'; 
	   }
	  if(indicatorShowing) { 
		 hideIndicator(); 
	  }
	 showIndicator(e.title);	
  }
  

});
Ti.App.addEventListener('change_title', function(e) {
  if(e.title) {
    hideIndicator();
  	showIndicator(e.title);
  }
});
Ti.App.addEventListener('hide_indicator', function(e) {
	hideIndicator();
});
