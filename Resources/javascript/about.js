Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};

(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
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
	  touchEnabled: false, //Avoid bounce on iPhone
	  html: "<html><meta name='viewport' content='width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;' /><body style='padding: 10px; font-size:14px;color:#fff;font-family:sans-serif;'>"+ cc.html + '</body></html>'
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
		if(e.index==3){
			return;
		}

		var go2Page='';	
		var go2PageTitle='';	
		if(e.index==0){
			go2PageTitle=Ti.Locale.getString('about_quake');
			go2Page='about_d.js';		
		}
		if(e.index==1){
			go2PageTitle=Ti.Locale.getString('about_cc');
			go2Page='about_cc.js';
		}
		if(e.index==2){
			go2PageTitle=Ti.Locale.getString('about_app');
			go2Page='about_app.js';
		}

		//Just in case
		if(go2Page.length==0){
			return;
		}
		
		var wPage = Ti.UI.createWindow({  
		    barColor:cc.win.barColor,
		    backgroundImage:'../images/back.png',
			navBarHidden:false,
			url:go2Page,
			title:go2PageTitle
		});		
	
		wPage.open({modal:true});
	});
});	

if(isAndroid()){
	Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;

		var mAboutD = menu.add({title: Ti.Locale.getString('about_quake') });
	    mAboutD.addEventListener("click", function(e) {
			var wAboutD = Ti.UI.createWindow({  
			    barColor:cc.win.barColor,
			    backgroundImage:'../images/back.png',
				navBarHidden:true,
				fullscreen:false,
				url:'about_d.js'
			});
			wAboutD.open();
	    });
	    var mAboutCC = menu.add({title: Ti.Locale.getString('about_cc') });
	 //   mAboutCC.setIcon('../../Images/Toolbar/calendar.png');
	    mAboutCC.addEventListener("click", function(e) {
			var wAboutCC = Ti.UI.createWindow({  
			    barColor:cc.win.barColor,
			    backgroundImage:'../images/back.png',
				navBarHidden:true,
				fullscreen:false,
	    		url:'about_cc.js'
			});
		  	wAboutCC.open();
	    });
		var mAboutAp = menu.add({title: Ti.Locale.getString('about_app') });
	    mAboutAp.addEventListener("click", function(e) {
			var wAboutAp = Ti.UI.createWindow({  
			    barColor:cc.win.barColor,
			    backgroundImage:'../images/back.png',
				navBarHidden:true,
				fullscreen:false,
	    		url:'about_app.js'
			});
		  	wAboutAp.open();
	    });
	};
}