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
		cc.nameBox = Ti.UI.createView({id:'nameBoxCC'});
		cc.mainContainer.add(cc.nameBox);		
		cc.aboutCC = Ti.UI.createLabel({
			text:'About CrisisCommons',
			id:'aboutCC'
		});	
		cc.nameBox.add(cc.aboutCC);
	}	
	cc.logoBox = Ti.UI.createView({
		top:isAndroid()?10:20,
		id:'logoBoxCC'
	});
	cc.mainContainer.add(cc.logoBox);
		
	cc.ccLogoCC = Ti.UI.createImageView({
		    image:'../images/charity_logos/crisis_commons.png',
			height:97,
			width:250
	  });

	cc.logoBox.add(cc.ccLogoCC);
	
	cc.descBox = Ti.UI.createView({
		top:isAndroid()?10:20,
		id:'descBoxCC'
	});
	cc.mainContainer.add(cc.descBox);

	cc.descCC = Ti.UI.createLabel({id:'descCC'});	
	cc.descBox.add(cc.descCC);
	
	cc.webButton = Ti.UI.createView({id:'webButtonCC'});

	if(!isAndroid()){
		cc.webButton.backgroundGradient={
			type:'linear',
			colors:[{color:'#d4d4d4',position:0.0},{color:'#c4c4c4',position:0.50},{color:'#b4b4b4',position:1.0}]
		};
	}
	cc.win.add(cc.webButton);

	cc.webImg = Ti.UI.createView({id:'webImgCC'});
	cc.webButton.add(cc.webImg);

	cc.webButtonLabel = Ti.UI.createLabel({id:'webButtonLabelCC'});
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
	   Ti.Platform.openURL("http://crisiscommons.org/");
	}
});