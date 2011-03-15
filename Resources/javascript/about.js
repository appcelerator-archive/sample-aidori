Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){
	
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];

	cc.infoButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.INFO_LIGHT});
	if(!isAndroid()){
		cc.win.rightNavButton=cc.infoButton;
	}
	
	cc.mainContainer = Ti.UI.createView({top:5 ,layout:'vertical'});
	cc.win.add(cc.mainContainer);
	
	if(isAndroid()){
		cc.nameBox = Ti.UI.createView({id:'nameBoxD'});
		cc.mainContainer.add(cc.nameBox);		
		cc.aboutCC = Ti.UI.createLabel({
			text:'About Sendai Earthquake & Tsunami',
			id:'aboutD'
		});	
		cc.nameBox.add(cc.aboutCC);
	}	
	cc.logoBox = Ti.UI.createView({
		top:isAndroid()? 5: 0,
		id:'logoBoxD'
	});
	cc.mainContainer.add(cc.logoBox);
		
	cc.ccLogoD = Ti.UI.createImageView({
		    image:'../images/wikipedia_logo.png',
			height:100,
			width:82
	  });

	cc.logoBox.add(cc.ccLogoD);
	
	cc.descBox = Ti.UI.createView({
		top:10,
		id:'descBoxD'
	});
	cc.mainContainer.add(cc.descBox);

	cc.descCC = Ti.UI.createLabel({id:'descD'});	
	cc.descBox.add(cc.descCC);
	
	cc.webButton = Ti.UI.createView({id:'webButtonD',
		bottom:isAndroid()? 5 : 10
	});

	if(!isAndroid()){
		cc.webButton.backgroundGradient={
			type:'linear',
			colors:[{color:'#d4d4d4',position:0.0},{color:'#c4c4c4',position:0.50},{color:'#b4b4b4',position:1.0}]
		};
	}
	cc.win.add(cc.webButton);

	cc.webImg = Ti.UI.createView({id:'webImgD'});
	cc.webButton.add(cc.webImg);

	cc.webButtonLabel = Ti.UI.createLabel({id:'webButtonLabelD'});
	cc.webButton.add(cc.webButtonLabel);		
})();

//--------------------------------------
//		Events
//--------------------------------------
cc.webButton.addEventListener('click', function(){
	if (!Ti.Network.online){
	 	  noNetworkAlert();
	} else {
	   Ti.Platform.openURL("http://en.wikipedia.org/wiki/2011_Sendai_earthquake_and_tsunami");
	}
});

//-----------------------------------
//		Events
//-----------------------------------	

cc.infoButton.addEventListener('click', function(){
	// create dialog
	var dialog = Ti.UI.createOptionDialog({
			options:[Ti.Locale.getString('about_cc'),
					 Ti.Locale.getString('about_app'),
					Ti.Locale.getString('about_cancel')
					],
			cancel:3,
			title:Ti.Locale.getString('about_dialog_title')
	});

	dialog.show();
	dialog.addEventListener('click', function(e){
		if(e.index==2){
			return;
		}

		var go2Page='';	
		var go2PageTitle='';	

		if(e.index==0){
			go2PageTitle=Ti.Locale.getString('about_cc');
			go2Page='about_cc.js';
		}
		if(e.index==1){
			go2PageTitle=Ti.Locale.getString('about_app');
			go2Page='about_app.js';
		}

		//Just in case
		if(go2Page.length==0){
			return;
		}
		
		var wPage = Ti.UI.createWindow({  
		    barColor:cc.win.barColor,
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