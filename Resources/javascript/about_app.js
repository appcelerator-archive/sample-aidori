Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	cc.selectedTabIndex=0;
	cc.mainContainer = Ti.UI.createView({
		height:isAndroid() ? 380 : 340,
		borderRadius:isAndroid() ? 10 : 5, 
		id:'mainContainer'
		});
	cc.win.add(cc.mainContainer);
	
	cc.tabContainer = Ti.UI.createView({id:'tabContainer'});
	cc.mainContainer.add(cc.tabContainer);
	
	cc.tabThisApp = Ti.UI.createView({id:'tabThisApp'});
	cc.tabContainer.add(cc.tabThisApp);
	
	cc.thisAppLabel = Ti.UI.createLabel({id:'thisAppLabel'});	
	cc.tabThisApp.add(cc.thisAppLabel);
		
	cc.tabAppcelerator = Ti.UI.createView({id:'tabAppcelerator'});
	cc.tabContainer.add(cc.tabAppcelerator);
	
	
	cc.appceleratorLabel = Ti.UI.createLabel({
		text:'Appcelerator',
		id:'appceleratorLabel'
		});	
	cc.tabAppcelerator.add(cc.appceleratorLabel);
	
	cc.topContainer = Ti.UI.createView({id:'topContainer'});
	cc.mainContainer.add(cc.topContainer);
	
	
	cc.infoLogo = Ti.UI.createImageView({
		    image:'../images/volunteer.png',
			height:50, width:50
	});
	cc.topContainer.add(cc.infoLogo);

	cc.infoName = Ti.UI.createLabel({id:'infoName'});	
	cc.topContainer.add(cc.infoName);

	cc.Line1 = Ti.UI.createView({id:'vwLine'});
	cc.mainContainer.add(cc.Line1);

	cc.detailInfo = Ti.UI.createLabel({id:'detailInfo'});
	cc.moreInfoScroll = Ti.UI.createScrollView({
		height:isAndroid() ? 220 : 180,
		id:'moreInfoScroll'
		});

	cc.moreInfoScroll.add(cc.detailInfo);
	cc.mainContainer.add(cc.moreInfoScroll);

	cc.bottomContainer = Ti.UI.createView({id:'bottomContainer'});
	cc.mainContainer.add(cc.bottomContainer);
	
	cc.webImg = Ti.UI.createView({id:'webImg'});
	cc.bottomContainer.add(cc.webImg);
	cc.webButtonLabel = Ti.UI.createLabel({id:'webButtonLabel'});
	cc.bottomContainer.add(cc.webButtonLabel);
						
})();

//-----------------------------------
//		Events
//-----------------------------------
cc.bottomContainer.addEventListener('click', function(){
	if (!Ti.Network.online){
	 	  noNetworkAlert();
	} else {
	   var urlText='http://wiki.appcelerator.org/display/titans/Japan+2011+Quake+Relief';
		if(cc.selectedTabIndex==0){
		   urlText='http://wiki.appcelerator.org/display/titans/Japan+2011+Quake+Relief';
		}
		if(cc.selectedTabIndex==1){
		   urlText='http://www.appcelerator.com/';
		}				
	   Ti.Platform.openURL(urlText);
	}
});
cc.tabThisApp.addEventListener('click', function(){
	cc.selectedTabIndex=0;
	cc.infoName.text=Ti.Locale.getString('about_app_this_app_title');
	cc.infoLogo.image='../images/volunteer.png';
	cc.tabThisApp.backgroundImage='../images/buttons/button_spacer_selected.png';
	cc.tabAppcelerator.backgroundImage='../images/buttons/button_spacer.png';
	cc.detailInfo.text=Ti.Locale.getString('about_app_team');
	cc.thisAppLabel.color='#fff';
	cc.thisAppLabel.font={
		fontSize:'13',fontWeight:'Bold'
	};
	cc.appceleratorLabel.color='#999';
	cc.appceleratorLabel.font={
		fontSize:'13',fontWeight:'Normal'
	};
});


cc.tabAppcelerator.addEventListener('click', function(){
	cc.selectedTabIndex=1;
	cc.infoName.text=Ti.Locale.getString('about_app_appcelerator_title');
	cc.infoLogo.image='../images/appcelerator50.png';
	cc.tabThisApp.backgroundImage='../images/buttons/button_spacer.png';
	cc.tabAppcelerator.backgroundImage='../images/buttons/button_spacer_selected.png';
	cc.detailInfo.text=Ti.Locale.getString('about_appcelerator_desc');		
	cc.thisAppLabel.color='#999';
	cc.thisAppLabel.font={
		fontSize:'13',fontWeight:'Normal'
	};
	cc.appceleratorLabel.color='#fff';
	cc.appceleratorLabel.font={
		fontSize:'13',fontWeight:'Bold'
	};
});

