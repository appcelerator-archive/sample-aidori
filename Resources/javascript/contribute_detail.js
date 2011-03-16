var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js');
(function(){

	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
	cc.mainContainer = Ti.UI.createView({
		height:isAndroid() ? 370 : 340,
		id:'mainContainer'
		});
	cc.win.add(cc.mainContainer);
		
	cc.topContainer = Ti.UI.createView({id:'topContainer'});
	cc.mainContainer.add(cc.topContainer);

	cc.chartiyLogo = Ti.UI.createImageView({
		    image:cc.win.charity_logo,
			height:75, width:75
	});
	cc.topContainer.add(cc.chartiyLogo);

	cc.charityName = Ti.UI.createLabel({
			text:cc.win.charity_name,
			id:'charityName'
		});	
	cc.topContainer.add(cc.charityName);

	cc.Line1 = Ti.UI.createView({id:'vwLine'});
	cc.mainContainer.add(cc.Line1);

	cc.charityAdr = Ti.UI.createLabel({
			text:cc.win.charity_address,
			id:'charityAdr'
		});
	cc.mainContainer.add(cc.charityAdr);
	cc.Line2 = Ti.UI.createView({id:'vwLine'});
	cc.mainContainer.add(cc.Line2);								


	cc.charityInfo = Ti.UI.createLabel({
		text:cc.win.info_text,
		id:'charityInfo'
	});

	cc.moreInfoScroll = Ti.UI.createScrollView({id:'moreInfoScroll'});

	cc.moreInfoScroll.add(cc.charityInfo);
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

})();

//------------------------------
//	Events
//------------------------------

cc.phoneButton.addEventListener('click', function(){
	if(cc.win.phone_num.length>0){
		Ti.Platform.openURL('tel:' + cc.win.phone_num);	
	}
});

cc.webButton.addEventListener('click', function(){
	if(cc.win.web_link.length==0){
		return;
	}
	
	if (!Ti.Network.online){
	 	  noNetworkAlert();
	} else {
	   Ti.Platform.openURL(cc.win.web_link);
	}
});