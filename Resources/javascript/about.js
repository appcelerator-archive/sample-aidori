Titanium.include('./application.js');

var cc ={win:Ti.UI.currentWindow};

(function(){
	cc.aboutImage = Ti.UI.createImageView({
	  //url:'../images/about.png',
	});
	cc.win.add(cc.aboutImage);
	
	Ti.App.addEventListener("openURL", function(e){
	  Ti.Platform.openURL(e.url);
	});
	
	//Titanium.Locale.currentCountry
	try {
		f = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, '/htmlfiles/'+cc.getCountry()+'/about.html');
		var  html = f.read();
	} catch (e) {
		f = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, '/htmlfiles/en/about.html');
		var  html = f.read();		
	}
	
	
	
	cc.webView = Ti.UI.createWebView({
	  top: 0,
	  left: 0,
	  width: 320,
	  height: (Titanium.Platform.name == 'android' ? (Titanium.Platform.displayCaps.platformHeight-90) :370),
	  backgroundColor:'transparent',
	  html: "<html><body style='padding: 10px; font-size:14px;color:#fff;font-family:sans-serif;'>"+html+'</body></html>'
	});
	
	cc.win.add(cc.webView)
})();