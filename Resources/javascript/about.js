Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){
	
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];

	cc.infoButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.INFO_LIGHT});
	cc.navBarPhone = Ti.UI.createButton({
	    image:'../images/light_phone.png'
	});
	if(!isAndroid()){
		cc.win.leftNavButton=cc.infoButton;
		cc.win.rightNavButton=cc.navBarPhone;
	}
	
	cc.mainContainer = Ti.UI.createView({top:5 ,layout:'vertical'});
	cc.win.add(cc.mainContainer);
	
	cc.nameBox = Ti.UI.createView({id:'nameBoxD'});
	cc.mainContainer.add(cc.nameBox);		
	cc.aboutCC = Ti.UI.createLabel({
		id:'aboutD'
	});	
	cc.nameBox.add(cc.aboutCC);
	
	cc.crisisInfo = Ti.UI.createLabel({id:'crisisInfo'});

	cc.moreInfoScroll = Ti.UI.createScrollView({
			width:(Ti.Platform.displayCaps.platformWidth-20),
			id:'moreInfoScroll'
		});

	cc.moreInfoScroll.add(cc.crisisInfo);
	cc.mainContainer.add(cc.moreInfoScroll);	
	
	cc.resourcesBox = Ti.UI.createView({id:'resourcesBoxD'});
	cc.mainContainer.add(cc.resourcesBox);		
	cc.aboutRE = Ti.UI.createLabel({
		text:Ti.Locale.getString('about_resource_link_title'),
		id:'resourcesD'
	});	
	cc.resourcesBox.add(cc.aboutRE);	
	cc.resourcesArrow = Ti.UI.createImageView({
		height:25,
		width:25,
		right:5,
		image:'../images/dark_more.png'
	});
	
	cc.resourcesBox.add(cc.resourcesArrow);
})();


//-----------------------------------
//		Events
//-----------------------------------	
cc.resourcesBox.addEventListener('click', function(){
	var wAboutRE = Ti.UI.createWindow({  
	    barColor:cc.win.barColor,
	    backgroundImage:'../images/back.png',
		title:Ti.Locale.getString('about_resources_page_title'),
		backButtonTitleImage:'../images/icon_arrow_left.png',
		url:'about_resources.js'
	});
	Ti.UI.currentTab.open(wAboutRE,{animated:true});
});
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

cc.phoneNumberList=function(){
	var cancelIdex=4;
	var optionsValues=["Iwate: 0120-801-471",
			 "Miyagi: 022-221-2000",
			 "Fukushima: 0120-510-186",
			 "Fukushima: 090-8424-4207",
			 "Fukushima: 090-8424-4208"
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
cc.navBarPhone.addEventListener('click', function(){
	cc.phoneNumberList();
});	

if(isAndroid()){
	Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;

	    var mAboutPN = menu.add({title: Ti.Locale.getString('about_phone_title') });
		mAboutPN.addEventListener("click", function(e) {
				cc.phoneNumberList();
		});
	    var mAboutCC = menu.add({title: Ti.Locale.getString('about_cc') });
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