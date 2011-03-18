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
	
	cc.mainContainer = Ti.UI.createView({
		height:isAndroid() ? 370 : 340,
		borderRadius:isAndroid() ? 10 : 5,
		id:'mainContainer'
		});
	cc.win.add(cc.mainContainer);
	
	cc.crisisName = Ti.UI.createLabel({id:'crisisName'});	
	cc.mainContainer.add(cc.crisisName);

	cc.Line1 = Ti.UI.createView({id:'vwLine'});
	cc.mainContainer.add(cc.Line1);
	
	cc.crisisInfo = Ti.UI.createLabel({id:'crisisInfo'});

	cc.moreInfoScroll = Ti.UI.createScrollView({
		height:240,
		contentHeight:'auto',
		contentWidth:'auto'
		});

	cc.moreInfoScroll.add(cc.crisisInfo);
	cc.mainContainer.add(cc.moreInfoScroll);

	cc.bottomContainer = Ti.UI.createView({id:'bottomContainer'});
	cc.mainContainer.add(cc.bottomContainer);
	
	cc.phoneButton = Ti.UI.createView({id:'phoneButton'});	
	cc.bottomContainer.add(cc.phoneButton);

	cc.phoneImg = Ti.UI.createView({id:'phoneImg'});
	cc.phoneButton.add(cc.phoneImg);
	
	cc.phoneButtonLabel = Ti.UI.createLabel({id:'phoneButtonLabel'});	
	cc.phoneButton.add(cc.phoneButtonLabel);
	
	cc.webButton = Ti.UI.createView({id:'webButton'});	
	cc.bottomContainer.add(cc.webButton);
				
	cc.webImg = Ti.UI.createView({id:'webImg'});
	cc.webButton.add(cc.webImg);
	cc.webButtonLabel = Ti.UI.createLabel({id:'webButtonLabel'});
	cc.webButton.add(cc.webButtonLabel);
	
		if(isAndroid()){
			var estMainContWidth=(Ti.Platform.displayCaps.platformWidth-20);
			//Divide by zero check
			if(estMainContWidth<1){
				estMainContWidth=300;
			}
			cc.bottomContainer.width=estMainContWidth;
	//		Ti.API.info('estMainContWidth=' + estMainContWidth);
			cc.phoneButton.width=((estMainContWidth/2));
			cc.webButton.width=((estMainContWidth/2));
		}
})();

//-----------------------------------
//		Events
//-----------------------------------	
cc.webButton.addEventListener('click', function(){
	var wAboutRE = Ti.UI.createWindow({  
	    barColor:cc.win.barColor,
	    backgroundImage:'../images/background/BG_gray.png',
		title:Ti.Locale.getString('about_resources_page_title'),
		backButtonTitleImage:'../images/icon_arrow_left.png',
		url:'about_resources.js'
	});
	Ti.UI.currentTab.open(wAboutRE,{animated:true});
});
cc.infoButton.addEventListener('click', function(){

	var wPage = Ti.UI.createWindow({  
	    barColor:cc.win.barColor,
		navBarHidden:false,
		title:Ti.Locale.getString('about_main_title'),
		url:'about_app.js',
		backgroundColor:'#f39380',
	    backButtonTitleImage:'../images/icon_arrow_left.png'
	});		

	Ti.UI.currentTab.open(wPage,{animated:true});
});

cc.phoneNumberList=function(){
	var cancelIdex=4;
	var optionsValues=[Ti.Locale.getString('about_phone_iwate'),
			 Ti.Locale.getString('about_phone_miyagi'),
			 Ti.Locale.getString('about_phone_fukushima1'),
			 Ti.Locale.getString('about_phone_fukushima2'),
			 Ti.Locale.getString('about_phone_fukushima3'),
	];
	
	if(!isAndroid()){
		optionsValues.push(Ti.Locale.getString('about_cancel'));
		cancelIdex=5;
	}
	// create dialog
	var dialog = Ti.UI.createOptionDialog({
			options:optionsValues,
			cancel:cancelIdex,
			title:Ti.Locale.getString('about_phone_title')
	});
	dialog.show();
	dialog.addEventListener('click', function(e){
		var phoneNumber='';
		if(e.index==0){
			phoneNumber='tel:0120801471';
		}
		if(e.index==1){
			phoneNumber='tel:0222212000';
		}
		if(e.index==2){
			phoneNumber='tel:0120510186';
		}
		if(e.index==3){
			phoneNumber='tel:09084244207';
		}	
		if(e.index==4){
			phoneNumber='tel:09084244208';
		}							
		if(phoneNumber.length>0){
			Ti.Platform.openURL(phoneNumber);	
		}
		
	});	
};
cc.phoneButton.addEventListener('click', function(){
	cc.phoneNumberList();
});	

if(isAndroid()){
	Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;

		var mAboutAp = menu.add({title: Ti.Locale.getString('about_app') });
	    mAboutAp.addEventListener("click", function(e) {
			var wPage = Ti.UI.createWindow({  
			    barColor:cc.win.barColor,
				navBarHidden:false,
				title:Ti.Locale.getString('about_main_title'),
				url:'about_app.js',
				backgroundColor:'#f39380',
			    backButtonTitleImage:'../images/icon_arrow_left.png'
			});		

			Ti.UI.currentTab.open(wPage,{animated:true});
	    });
	};
}
