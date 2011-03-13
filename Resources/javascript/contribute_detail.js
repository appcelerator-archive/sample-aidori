var cc ={win:Ti.UI.currentWindow};
Ti.include('./application.js');
(function(){

	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	cc.doneButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.DONE});
	if(!isAndroid()){
		cc.win.rightNavButton=cc.doneButton;
	}
	
	cc.mainContainer = Ti.UI.createView({layout:'vertical'});
	cc.win.add(cc.mainContainer);
		
	cc.nameBox = Ti.UI.createView({id:'nameBox'});
	cc.mainContainer.add(cc.nameBox);
		
	cc.charityName = Ti.UI.createLabel({
		text:cc.win.charity_name,
		id:'charityName'
	});	
	cc.nameBox.add(cc.charityName);

	cc.middleSection = Ti.UI.createView({
		width:(Ti.Platform.displayCaps.platformWidth-20),
		id:'middleSection'
	});
	cc.mainContainer.add(cc.middleSection);	

	cc.chartiyLogo = Ti.UI.createImageView({
		    image:cc.win.charity_logo,
			id:'chartiyLogo'
	  });

	cc.middleSection.add(cc.chartiyLogo);

	cc.middleSectionRight = Ti.UI.createView({id:'middleSectionRight'});
	cc.middleSection.add(cc.middleSectionRight);

	cc.charityPhone = Ti.UI.createLabel({
		text:Ti.Locale.getString('contribute_detail_phone_donate') + ' ' + cc.win.phone_text,
		id:'charityPhone'
	});

	cc.middleSectionRight.add(cc.charityPhone);

	cc.charityAddr = Ti.UI.createLabel({
		text:Ti.Locale.getString('contribute_detail_address_donate') + ' ' + cc.win.charity_address,
		id:'charityAddr'
	});

	cc.middleSectionRight.add(cc.charityAddr);

	cc.charityInfo = Ti.UI.createLabel({
		text:cc.win.info_text,
		id:'charityInfo'
	});

	cc.moreInfoScroll = Ti.UI.createScrollView({
			width:(Ti.Platform.displayCaps.platformWidth-20),
			id:'moreInfoScroll'
		});

	cc.moreInfoScroll.add(cc.charityInfo);
	cc.mainContainer.add(cc.moreInfoScroll);

	cc.phoneButton = Ti.UI.createView({id:'phoneButton'});

	if(!isAndroid()){
		cc.phoneButton.backgroundGradient={
			type:'linear',
			colors:[{color:'#d4d4d4',position:0.0},{color:'#c4c4c4',position:0.50},{color:'#b4b4b4',position:1.0}]
		};
	}
	cc.win.add(cc.phoneButton);

	cc.phoneImg = Ti.UI.createView({id:'phoneImg'});
	cc.phoneButton.add(cc.phoneImg);

	cc.phoneButtonLabel = Ti.UI.createLabel({id:'phoneButtonLabel'});	
	cc.phoneButton.add(cc.phoneButtonLabel);

	cc.webButton = Ti.UI.createView({id:'webButton'});

	if(!isAndroid()){
		cc.webButton.backgroundGradient={
			type:'linear',
			colors:[{color:'#d4d4d4',position:0.0},{color:'#c4c4c4',position:0.50},{color:'#b4b4b4',position:1.0}]
		};
	}
	cc.win.add(cc.webButton);

	cc.webImg = Ti.UI.createView({id:'webImg'});
	cc.webButton.add(cc.webImg);

	cc.webButtonLabel = Ti.UI.createLabel({id:'webButtonLabel'});
	cc.webButton.add(cc.webButtonLabel);		
})();

//------------------------------
//	Events
//------------------------------
cc.doneButton.addEventListener('click', function(){
	cc.win.close();
});

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