Titanium.include('./application.js');

var cc ={win:Ti.UI.currentWindow};

(function(){
	cc.html=''; //We'll use this later
	cc.infoButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.INFO_LIGHT});
	if(!isAndroid()){
		cc.win.rightNavButton=cc.infoButton;
	}
	
	function setUsingDefaultFile(){
		f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/htmlfiles/en/about.html');
		cc.html = f.read();		
	};
	
	if(Ti.Locale.currentLanguage=='en'){
		setUsingDefaultFile();
	}else{
		f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/htmlfiles/'+cc.getCountry()+'/about.html');
		if(!f.exists()){
			setUsingDefaultFile();
		}else{
			cc.html = f.read();	
		}		
	}
	
	cc.webView = Ti.UI.createWebView({
	  scalesPageToFit:true,
	  backgroundColor:'transparent',
	  html: "<html><meta name='viewport' content='width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;' /><body style='padding: 10px; font-size:14px;color:#fff;font-family:sans-serif;'>"+ cc.html + '</body></html>'
	});
	
	cc.win.add(cc.webView);
})();

//-----------------------------------
//		Events
//-----------------------------------	

cc.infoButton.addEventListener('click', function(){
	// create dialog
	var dialog = Ti.UI.createOptionDialog({
			options:[Ti.Locale.getString('about_quake'),
					 Ti.Locale.getString('about_cc'),
					 Ti.Locale.getString('about_app'),
					Ti.Locale.getString('about_cancel')
					],
			cancel:3,
			title:Ti.Locale.getString('about_dialog_title')
	});

	dialog.show();
	dialog.addEventListener('click', function(e){
				
	});
});	

if(isAndroid()){
	Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
		alert("I'm in the menu");
	//    var menu = e.menu;
	//	var wPage = Ti.UI.createWindow({  
	//	    barColor:myT.ui.win.barColor,
	//		DbConfig:myT.ui.win.DbConfig,
	//	    backgroundColor:'#fff',
	//		navBarHidden:true,
	//		fullscreen:false
	//	});
	  //  var mCalendar = menu.add({title: Ti.Locale.getString('tab_entry') });
	 //   mCalendar.setIcon('../../Images/Toolbar/calendar.png');
	 //   mCalendar.addEventListener("click", function(e) {
	 //     wPage.url='../Calendar/Month/month_ui.js';
	//	  wPage.open();
	  //  });

	};
}