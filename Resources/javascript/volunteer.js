Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){

	// Don't think this is needed anymore
	//if(Ti.Platform.name == 'android') {
	 // var bgImage = Ti.UI.createImageView({
	//    top:0,
	//    left:0,
	//    url:'../images/back.png',
	//    height:'auto',
	//    width:'auto'
	//  });
	//  win.add(bgImage);
	//}
	
	// ALABAMA
	cc.alabamaView = Ti.UI.createView({
	  top: 20,
	  left: 30,
	  width: 100,
	  height: 100
	});

	cc.alabamaFlag = Ti.UI.createImageView({
	  top: 0,
	  left: 0,
	  width: 100,
	  height:67,
	  image:'../images/flag_alabama.png',
	  preventDefaultImage:true
	});

	cc.alabamaView.add(cc.alabamaFlag);
	
	cc.alabamaLabel = Ti.UI.createLabel({
	  top: 80,
	  left: 0,
	  font:{fontSize:14, fontWeight:'bold'},
	  text:'Alabama',
	  color:'#fff',
	  textAlign:'center'
	});
	cc.alabamaView.add(cc.alabamaLabel);
	cc.win.add(cc.alabamaView);

	// LOUISIANA

	cc.louisianaView = Ti.UI.createView({
	  top: 20,
	  left: 190,
	  width: 100,
	  height: 100
	});

	cc.louisianaFlag = Ti.UI.createImageView({
	  top: 0,
	  left: 0,
	  width: 100,
	  height:67,
	  image:'../images/flag_louisiana.png',
	  preventDefaultImage:true
	});
	
	cc.louisianaView.add(cc.louisianaFlag);
	
	cc.louisianaLabel = Ti.UI.createLabel({
	  top: 80,
	  left: 0,
	  font:{fontSize:14, fontWeight:'bold'},
	  color:'#fff',
	  text:'Louisiana',
	  textAlign:'center'
	});
	
	cc.louisianaView.add(cc.louisianaLabel);
	cc.win.add(cc.louisianaView);

	// Mississippi

	cc.mississippiView = Ti.UI.createView({
	  top: 140,
	  left: 30,
	  width: 100,
	  height: 100
	});

	cc.mississippiFlag = Ti.UI.createImageView({
	  top: 0,
	  left: 0,
	  width: 100,
	  height:67,
	  image:'../images/flag_mississippi.png',
	  preventDefaultImage:true
	});

	cc.mississippiLabel = Ti.UI.createLabel({
	  top: 80,
	  left: 0,
	  font:{fontSize:14, fontWeight:'bold'},
	  text:'Mississippi',
	  color:'#fff',
	  textAlign:'center'
	});

	cc.mississippiView.add(cc.mississippiFlag);
	cc.mississippiView.add(cc.mississippiLabel);
	cc.win.add(cc.mississippiView);	
	
	// FLORIDA

	cc.floridaView = Ti.UI.createView({
	  top: 140,
	  left: 190,
	  width: 100,
	  height: 100
	});

	cc.floridaFlag = Ti.UI.createImageView({
	  top: 0,
	  left: 0,
	  width: 100,
	  height:67,
	  image:'../images/flag_florida.png',
	  preventDefaultImage:true
	});
	cc.floridaView.add(cc.floridaFlag);
	
	cc.floridaLabel = Ti.UI.createLabel({
	  top: 80,
	  left: 0,
	  font:{fontSize:14, fontWeight:'bold'},
	  color:'#fff',
	  text:'Florida',
	  textAlign:'center'
	});

	cc.floridaView.add(cc.floridaLabel);
	cc.win.add(cc.floridaView);

	cc.volunteerLabel = Ti.UI.createLabel({
	  top: (Ti.Platform.name != 'android' ? 240 : 250),
	  width: 320,
	  left: 0,
	  font:{fontSize:16, fontWeight:'normal'},
	  color:'#fff',
	  text:'For more information on how\nto volunteer, please call: \n(866) 448-5816',
	  textAlign:'center'
	});

	cc.win.add(cc.volunteerLabel);

	//-------------------------------
	//	Functions
	//-------------------------------
	cc.launchWebsiteIfOnline=function(url) {
	  if (!Ti.Network.online){
	  	noNetworkAlert();
	  } else {
	    Ti.Platform.openURL(url);
	  }
	};	
	
	//-------------------------------
	//	Events
	//-------------------------------
	cc.alabamaView.addEventListener("click",function(e) {
	  cc.launchWebsiteIfOnline("http://www.servealabama.gov/2010/default.aspx");
	});	
	
	cc.louisianaView.addEventListener("click",function(e) {
	  cc.launchWebsiteIfOnline("http://www.volunteerlouisiana.gov/");
	});	
	
	cc.mississippiView.addEventListener("click",function(e) {
	  cc.launchWebsiteIfOnline("http://www.volunteermississippi.org/1800Vol/OpenIndexAction.do");
	});	
	
	cc.floridaView.addEventListener("click",function(e) {
	  cc.launchWebsiteIfOnline("http://www.volunteerfloridadisaster.org/");
	});
})();




