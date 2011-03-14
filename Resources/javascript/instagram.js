var xhr = Titanium.Network.createHTTPClient();

var containerView = Titanium.UI.createView({
	width: '100%',
	height: '100%'
});	

var scrollView = Titanium.UI.createScrollView({
	width: '100%',
	layout:'horizontal',
	contentWidth: 320,
	contentHeight:'auto',
	backgroundColor: '#000'
});

Ti.UI.currentWindow.add(containerView);
containerView.add(scrollView);

xhr.onload = function()
{
	var data=JSON.parse(this.responseText);
	Ti.API.log(this.responseText);
	Ti.API.log("===============================");
	Ti.API.log(data);
	
	var i, length = data.data.length, picture;
	for(i = 0; i<length; i++)
	{
		picture = data.data[i];
		Ti.API.log(picture);
		var image = Ti.UI.createImageView({
			width: 160,
			height: 160,
			image: picture.images.thumbnail.url
		});
		scrollView.add(image);
	}
};
// open the client
xhr.open('GET','https://api.instagram.com/v1/tags/prayforjapan/media/recent?client_id=067b035e96cf459a9d0db4b66d6d1cf3');

// send the data
xhr.send();

