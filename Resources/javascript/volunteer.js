Titanium.include('./application.js');
var win = Titanium.UI.currentWindow;


if(Ti.Platform.name == 'android') {
  var bgImage = Ti.UI.createImageView({
    top:0,
    left:0,
    url:'../images/back.png',
    height:'auto',
    width:'auto'
  });
  win.add(bgImage);
}

// ALABAMA

var alabamaView = Ti.UI.createView({
  top: 20,
  left: 30,
  width: 100,
  height: 100
});

var alabamaFlag = Ti.UI.createImageView({
  top: 0,
  left: 0,
  width: 100,
  height:67,
  url:'../images/flag_alabama.png',
  preventDefaultImage:true
});

var alabamaLabel = Ti.UI.createLabel({
  top: 80,
  left: 0,
  font:{fontSize:14, fontWeight:'bold'},
  text:'Alabama',
  color:'#fff',
  textAlign:'center'
});

alabamaView.addEventListener("click",function(e) {
  launchWebsiteIfOnline("http://www.servealabama.gov/2010/default.aspx");
});

alabamaView.add(alabamaFlag);
alabamaView.add(alabamaLabel);
win.add(alabamaView);

// LOUISIANA

var louisianaView = Ti.UI.createView({
  top: 20,
  left: 190,
  width: 100,
  height: 100
});

var louisianaFlag = Ti.UI.createImageView({
  top: 0,
  left: 0,
  width: 100,
  height:67,
  url:'../images/flag_louisiana.png',
  preventDefaultImage:true
});

var louisianaLabel = Ti.UI.createLabel({
  top: 80,
  left: 0,
  font:{fontSize:14, fontWeight:'bold'},
  color:'#fff',
  text:'Louisiana',
  textAlign:'center'
});

louisianaView.addEventListener("click",function(e) {
  launchWebsiteIfOnline("http://www.volunteerlouisiana.gov/");
});

louisianaView.add(louisianaFlag);
louisianaView.add(louisianaLabel);
win.add(louisianaView);

// Mississippi

var mississippiView = Ti.UI.createView({
  top: 140,
  left: 30,
  width: 100,
  height: 100
});

var mississippiFlag = Ti.UI.createImageView({
  top: 0,
  left: 0,
  width: 100,
  height:67,
  url:'../images/flag_mississippi.png',
  preventDefaultImage:true
});

var mississippiLabel = Ti.UI.createLabel({
  top: 80,
  left: 0,
  font:{fontSize:14, fontWeight:'bold'},
  text:'Mississippi',
  color:'#fff',
  textAlign:'center'
});

mississippiView.addEventListener("click",function(e) {
  launchWebsiteIfOnline("http://www.volunteermississippi.org/1800Vol/OpenIndexAction.do");
});

mississippiView.add(mississippiFlag);
mississippiView.add(mississippiLabel);
win.add(mississippiView);

// FLORIDA

var floridaView = Ti.UI.createView({
  top: 140,
  left: 190,
  width: 100,
  height: 100
});

var floridaFlag = Ti.UI.createImageView({
  top: 0,
  left: 0,
  width: 100,
  height:67,
  url:'../images/flag_florida.png',
  preventDefaultImage:true
});

var floridaLabel = Ti.UI.createLabel({
  top: 80,
  left: 0,
  font:{fontSize:14, fontWeight:'bold'},
  color:'#fff',
  text:'Florida',
  textAlign:'center'
});

floridaView.addEventListener("click",function(e) {
  launchWebsiteIfOnline("http://www.volunteerfloridadisaster.org/");
});

floridaView.add(floridaFlag);
floridaView.add(floridaLabel);
win.add(floridaView);



var volunteerLabel = Ti.UI.createLabel({
  top: (Ti.Platform.name != 'android' ? 240 : 250),
  width: 320,
  left: 0,
  font:{fontSize:16, fontWeight:'normal'},
  color:'#fff',
  text:'For more information on how\nto volunteer, please call: \n(866) 448-5816',
  textAlign:'center'
});

win.add(volunteerLabel);

function launchWebsiteIfOnline(url) {
  if (Titanium.Network.online == false){
  	Titanium.UI.createAlertDialog({
  	  title:"Connection Required",
  	  message:"We cannot detect a network connection.  You need an active network connection to be able to view this website."
  	}).show();
  } else {
    Titanium.Platform.openURL(url);
  }
}