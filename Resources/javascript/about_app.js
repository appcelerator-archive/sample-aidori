Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	cc.mainContainer = Ti.UI.createView({top:isAndroid() ? 20 : 5 ,layout:'vertical'});
	cc.win.add(cc.mainContainer);
	
	cc.doneButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.DONE});
	if(!isAndroid()){
		cc.win.rightNavButton=cc.doneButton;
	}
	
	if(isAndroid()){
		cc.nameBox = Ti.UI.createView({id:'nameBox'});
		cc.mainContainer.add(cc.nameBox);		
		cc.aboutCC = Ti.UI.createLabel({
			text:'About This Application',
			id:'aboutAp'
		});	
		cc.nameBox.add(cc.aboutCC);
	}	
	cc.middleSection = Ti.UI.createView({
		width:(Ti.Platform.displayCaps.platformWidth-20),
		top:isAndroid() ? 10 : 5 ,
		id:'middleSection'
	});
	cc.mainContainer.add(cc.middleSection);
		
	cc.ccLogo = Ti.UI.createImageView({
		    image:'../images/appcelerator.png',
			height:100,
			width:100
	  });

	cc.middleSection.add(cc.ccLogo);

	cc.titanInfo = Ti.UI.createLabel({
		textid:'Some meaningful message',
		height:'auto',
		left:5,
		width:100,
		color:'#000',
		textAlign:'center',
		top:5,
		font:{fontSize:12,fontWeight:'Bold'}
		});
	cc.middleSection.add(cc.titanInfo);
		
	cc.teamInfo = Ti.UI.createLabel({
		text:Ti.Locale.getString('about_app_team'),
		height:'auto',
		textAlign:'left',
		color:'#000',
		font:{fontSize:12},
		left:5,
		right:5,
		top:5
	});

	cc.moreInfoScroll = Ti.UI.createScrollView({
			width:(Ti.Platform.displayCaps.platformWidth-20),
			top:isAndroid() ? 10 : 5 ,
			id:'moreInfoScroll'
		});

	cc.moreInfoScroll.add(cc.teamInfo);
	cc.mainContainer.add(cc.moreInfoScroll);
	
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

//--------------------------------------
//		Events
//--------------------------------------
cc.doneButton.addEventListener('click', function(){
	cc.win.close();
});
cc.webButton.addEventListener('click', function(){
	if (!Ti.Network.online){
	 	  noNetworkAlert();
	} else {
	   Ti.Platform.openURL("http://wiki.appcelerator.org/display/titans/Japan+2011+Quake+Relief");
	}
});