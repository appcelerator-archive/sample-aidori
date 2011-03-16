Ti.App.fireEvent('show_indicator');

var cc ={win:Ti.UI.currentWindow};
(function(){
	cc.refreshButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.REFRESH});
	if (Ti.Platform.name != 'android') {
		Ti.UI.currentWindow.setLeftNavButton(cc.refreshButton);
	};
	
	var xhr = Titanium.Network.createHTTPClient();

	var containerView = Titanium.UI.createView({
		width: '100%',
		height: '100%'
	});	

	var scrollView = Titanium.UI.createScrollView({
		width: '100%',
		layout:'horizontal',
		contentWidth: Ti.Platform.displayCaps.platformWidth,
		contentHeight:'auto',
		backgroundColor: '#000'
	});
	
	var detailView = Titanium.UI.createScrollableView({
		top: 0,
		left: 0,
		width: Ti.Platform.displayCaps.platformWidth,
		height: Ti.Platform.displayCaps.platformHeight,
		backgroundColor: 'red',
		visible: false
	});
	scrollView.addEventListener('singletap',function(e)
	{
		Ti.API.log(e);
	});
	Ti.UI.currentWindow.add(containerView);
	containerView.add(scrollView);
	containerView.add(detailView);

	cc.retrieveInstagramFeed = function()
	{
		xhr.onload = function()
		{
			var data=JSON.parse(this.responseText);
			/*
			Ti.API.log(this.responseText);
			Ti.API.log("===============================");
			Ti.API.log(data);
			*/
			var i, length = data.data.length, picture;
			for(i = 0; i<length; i++)
			{
				picture = data.data[i];
				//Ti.API.log(picture);
				var thumbnail = Ti.UI.createImageView({
					width: Ti.Platform.displayCaps.platformWidth/2,
					height: Ti.Platform.displayCaps.platformWidth/2,
					defaultImage: '../images/default_image.png',
					image: picture.images.thumbnail.url
				});
				scrollView.add(thumbnail);
				
				var standard_resolution = Ti.UI.createImageView({
					width: Ti.Platform.displayCaps.platformWidth,
					height: Ti.Platform.displayCaps.platformWidth,
					defaultImage: '../images/default_image.png',
					image: picture.images.standard_resolution.url
				});
				
				detailView.views[i] = standard_resolution;
				
				
			}
			Ti.App.fireEvent('hide_indicator',{});
			
		};
		// open the client
		xhr.open('GET','https://api.instagram.com/v1/tags/prayforjapan/media/recent?client_id=067b035e96cf459a9d0db4b66d6d1cf3');

		// send the data
		xhr.send();
	}
	
	if (!Ti.Network.online){
	  	Ti.App.fireEvent('hide_indicator',{});
		noNetworkAlert();
	} else {
		cc.retrieveInstagramFeed();
	}
	
	cc.refreshButton.addEventListener('click', function(){
		if (!Ti.Network.online) {
			Ti.App.fireEvent('hide_indicator', {});
			noNetworkAlert();
		}
		else {
			Ti.App.fireEvent('show_indicator', {});
			cc.retrieveInstagramFeed();
		}
	});
	
})();

