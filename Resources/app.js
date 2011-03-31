if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
    Ti.UI.iPhone.showStatusBar({'animated': false});
}

Ti.include('javascript/application.js');
var indicatorShowing = false;
var useThisBackgroundColor='#FFFFFF';
var useThisBarColor='#e62600';

//For some reason we need to case into a property before doing a check against the value
var welcomeMsgCheck = Ti.App.Properties.hasProperty('disclaimerViewed');

var tabGroup = Ti.UI.createTabGroup();
var newsWin = Ti.UI.createWindow({  
  url:'javascript/news.js',
  barColor:useThisBarColor,
  welcomeMsgOpen:!(welcomeMsgCheck),
  backgroundColor:(Ti.Platform.name == 'android') ? '#fff' :useThisBackgroundColor,
  titleid:L('crisis_title')
});
var newsTab = Ti.UI.createTab({  
  icon:'images/tabs/TAB_news.png',
  title:L('tab_news'),
  window:newsWin
});

var socialWin = Ti.UI.createWindow({  
  url:'javascript/social.js',
  backgroundColor:useThisBackgroundColor,
  title:L('social_page_title'),
  barColor:useThisBarColor
});
var socialTab = Ti.UI.createTab({  
  icon:'images/tabs/TAB_social.png',
  title:L('social_tab_name'),
  window:socialWin
});

var contributeWin = Ti.UI.createWindow({  
  url:'javascript/contribute.js',
  backgroundColor:useThisBackgroundColor,
  title:L('contribute_page_title'),
  barColor:useThisBarColor
});
var contributeTab = Ti.UI.createTab({  
  icon:'images/tabs/TAB_contribute.png',
  backgroundColor:useThisBackgroundColor,
  title:L('tab_contribute'),
  window:contributeWin
});

var aboutWin = Ti.UI.createWindow({  
  url:'javascript/about.js',
  backgroundColor:useThisBackgroundColor,
  title:L('about_page_title'),
  barColor:useThisBarColor
});
var aboutTab = Ti.UI.createTab({  
  icon:'images/tabs/TAB_about.png',
  title:L('tab_about'),
  window:aboutWin
});

var mapWin = Ti.UI.createWindow({
	url:'javascript/map.js',
    backgroundColor:useThisBackgroundColor,
	barColor:useThisBarColor,
	title:L('title_map')
});
var mapTab = Ti.UI.createTab({
	icon:'images/tabs/TAB_map.png',
	title:L('tab_map'),
	window:mapWin
});
tabGroup.addTab(newsTab);  
tabGroup.addTab(mapTab);
tabGroup.addTab(contributeTab);  
tabGroup.addTab(socialTab);
tabGroup.addTab(aboutTab); 

tabGroup.addEventListener('focus', function(e){
	if(e.index == 1){
		Ti.App.fireEvent('map_shelter_check');
	}
});

var disclaimerWin = Ti.UI.createWindow({
  url:'javascript/disclaimer.js',
  backgroundColor:useThisBackgroundColor,
  title:L('disclaimer_title'),
  barColor:useThisBarColor,
  backTitle:'Close',
  tabBarHidden:true
});


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
  	var message = Ti.UI.createLabel({
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
	    if (actInd && actInd !== null) {
	       actInd.hide();
	    }
	    
	    if (indWin && indWin !== null) {
	       indWin.close({opacity:0,duration:500});
	    }
	  	
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

Ti.include("javascript/check_contents.js");

tabGroup.open();


if (!welcomeMsgCheck) {
	disclaimerWin.open({modal:true});
}
