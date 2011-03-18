Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){
	cc.win.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
	
	cc.mainContainer = Ti.UI.createView({
		height:isAndroid() ? 370 : 340,
		borderRadius:isAndroid() ? 10 : 5,
		id:'mainContainer'
		});
	cc.win.add(cc.mainContainer);
	
	
	cc.twitterContainer = Ti.UI.createView({
		borderRadius:isAndroid() ? 10 : 5,
		borderWidth:1,
		borderColor:'#999',
		height:125,
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
			height:25,
			width:25,
			right:10
	  });
	
	cc.twitterContainer.add(cc.twitterLogoMore);
		
	cc.instagramContainer = Ti.UI.createView({
		borderRadius:isAndroid() ? 10 : 5,
		borderWidth:1,
		borderColor:'#999',
		height:125,
		left:10,
		right:10,
		top:50
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
			height:25,
			width:25,
			right:10
	  });
	
	cc.instagramContainer.add(cc.instagramLogoMore);	
	
})();

cc.twitterContainer.addEventListener('click', function(){
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
		wPage.open();
	}else{
		Ti.UI.currentTab.open(wPage,{animated:true});	
	}
});

cc.instagramContainer.addEventListener('click', function(){
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
		wPage.open();
	}else{
		Ti.UI.currentTab.open(wPage,{animated:true});	
	}
});