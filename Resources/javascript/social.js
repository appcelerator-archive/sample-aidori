Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){

	cc.win.backgroundColor ='#CCCCCC';

	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
	cc.mainContainer = Ti.UI.createView({
		height:250,
		top:45,
		borderRadius:isAndroid() ? 10 : 5,
		id:'mainContainer'
		});
	cc.win.add(cc.mainContainer);
	
	
	cc.twitterContainer = Ti.UI.createView({
//		borderRadius:isAndroid() ? 10 : 5,
//		borderWidth:1,
//		borderColor:'#999',
		backgroundColor:'#fff',
		height:70,
		left:10,
		right:10,
		top:25
	});

	cc.mainContainer.add(cc.twitterContainer);
			
	cc.twitterLogo = Ti.UI.createImageView({
		    image:'../images/twitter_logo_header.png',
		  	preventDefaultImage:true,
			height:36,
			width:155,
			left:20
	  });
	
	cc.twitterContainer.add(cc.twitterLogo);

	cc.twitterLogoMore = Ti.UI.createImageView({
		    image:'../images/dark_more.png',
		  	preventDefaultImage:true,
			height:27,
			width:26,
			right:10
	  });
	
	cc.twitterContainer.add(cc.twitterLogoMore);

	cc.vwLine = Ti.UI.createView({
		top:20,
		height:1,
		right:25,
		left:25,
		borderColor:'#000'
	  });				
	cc.mainContainer.add(cc.vwLine);
	
	cc.instagramContainer = Ti.UI.createView({
//		borderRadius:isAndroid() ? 10 : 5,
//		borderWidth:1,
//		borderColor:'#999',
		backgroundColor:'#fff',
		height:70,
		left:10,
		right:10,
		top:20
	});
	
	cc.mainContainer.add(cc.instagramContainer);
	
	cc.instagramLogo = Ti.UI.createImageView({
		    image:'../images/instagram_title.png',
		  	preventDefaultImage:true,
			height:36,
			width:155,
			left:20
	  });
	
	cc.instagramContainer.add(cc.instagramLogo);

	cc.instagramLogoMore = Ti.UI.createImageView({
		    image:'../images/dark_more.png',
		  	preventDefaultImage:true,
			height:27,
			width:26,
			right:10
	  });
	
	cc.instagramContainer.add(cc.instagramLogoMore);	
	
})();

cc.twitterContainer.addEventListener('click', function(){
	if (!Ti.Network.online) {
		noNetworkAlert();
	}else{
		var wPage = Ti.UI.createWindow({  
		    barColor:cc.win.barColor,
			navBarHidden:false,
			title:Ti.Locale.getString('title_twitter'),
			backgroundColor:'#f39380',
			url:'twitter.js',
			backButtonTitleImage:'../images/icon_arrow_left.png'
		});

		//Handle by correct platform
		if (isAndroid()) {
			wPage.windowSoftInputMode=Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE;
		}
		Ti.UI.currentTab.open(wPage,{animated:true});		
	}

});

cc.instagramContainer.addEventListener('click', function(){
	if (!Ti.Network.online) {
		noNetworkAlert();
	}else{
		var wPage = Ti.UI.createWindow({  
		    barColor:cc.win.barColor,
			navBarHidden:false,
			title:Ti.Locale.getString('title_instagram'),
			backgroundColor:'#f39380',
			url:'instagram.js',
			backButtonTitleImage:'../images/icon_arrow_left.png'
		});
	
		//Handle by correct platform
		if (isAndroid()) {
			wPage.windowSoftInputMode=Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE;
		}
		Ti.UI.currentTab.open(wPage,{animated:true});	
	}
});