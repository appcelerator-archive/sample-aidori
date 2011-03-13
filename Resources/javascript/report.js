Titanium.include('./keys.js');
Titanium.include('./application.js');

var win = Ti.UI.currentWindow;

Ti.App.fireEvent('show_indicator');

var properties = Ti.App.Properties;
var currentImageView;
var currentImageAdded = false;
var wildlifeValue = "No wildlife present";
var hostname = "http://oilreporter.org";
var androidActivityIndicator;

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

// See
var scrollView = Ti.UI.createScrollView({
  top:0,
  left:0,
  contentWidth:320,
  contentHeight:710,
  height:480,
  width:320,
  verticalBounce: false
});

var seeView = Ti.UI.createView({
  top: 10,
  left: 10,
  width: 300,
  height: 160,
  backgroundColor:'#333',
  borderRadius:6
});

var seeTitleLabel = Ti.UI.createLabel({
  top: 5,
  left: 10,
  width: 300,
  height: 30,
  color: '#fff',
	font:{fontSize:18, fontWeight:'bold'},
  text:'What Do You See?'
});
seeView.add(seeTitleLabel);

var seeField = Ti.UI.createTextArea({
	value:'',
	top: 40,
	left: 10,
	height: 54,
	width:280,
	keyboardType:Ti.UI.KEYBOARD_ASCII,
	color:'#222',
	font:{fontSize: 14, fontWeight:"normal"},  
	borderWidth:2,
	borderColor:'#303030',
	borderRadius:6
});
seeField.addEventListener("return",function(e){
  seeField.blur();
});
seeView.add(seeField);

var mediaLabel = Ti.UI.createLabel({
  top: 100,
  left: 70,
  width: 280,
  height: 30,
  color: '#fff',
	font:{fontSize:16, fontWeight:'bold'},
  text:'Add a Photo'
});
var mediaDescLabel = Ti.UI.createLabel({
  top: (Ti.Platform.name != 'android' ? 120 : 128),
  left: 70,
  width: 280,
  height: 30,
  color: '#eee',
	font:{fontSize:12, fontWeight:'normal'},
  text:'Share with us what you\'re seeing'
});
seeView.add(mediaDescLabel);
seeView.add(mediaLabel);
var mediaView = Ti.UI.createView({
  top: 100,
  left: 10,
  width: 50,
  height: 50,
  backgroundColor:'#222',
  borderRadius:6
});

var mediaButtonBg = Ti.UI.createView({
  top: 2,
  left: ((mediaView.width - 46)/2),
  width: 46,
  height: 46,
  backgroundColor: '#000',
  borderRadius: 5
});

var mediaAddButton = Ti.UI.createButton({
  top: 1,
  left: 1,
  width: 44,
  height: 44,
  backgroundImage: '../images/icon_camera.png',
	backgroundSelectedImage: '../images/icon_camera.png',
	backgroundDisabledImage: '../images/icon_camera.png'
});

mediaAddButton.addEventListener('click', function() {
  displayMediaChooser();
});

mediaButtonBg.add(mediaAddButton);
mediaView.add(mediaButtonBg);
seeView.add(mediaView);
scrollView.add(seeView);

// Oil
var oilView = Ti.UI.createView({
  top: 185,
  left: 10,
  width: 300,
  height: 90,
  backgroundColor:'#5a5c64',
  borderRadius:6
});
var oilTitleLabel = Ti.UI.createLabel({
  top: 5,
  left: 10,
  width: 300,
  height: 30,
  color: '#fff',
	font:{fontSize:18, fontWeight:'bold'},
  text:"How Much Oil Do You See? (5)"
});
oilView.add(oilTitleLabel);

var oilDescLabel = Ti.UI.createLabel({
  top: (Ti.Platform.name == 'android' ? 30 : 25),
  left: 10,
  width: 300,
  height: 30,
  color: '#eee',
	font:{fontSize:12, fontWeight:'normal'},
  text:"0 is open water, 10 is thick oil"
});
oilView.add(oilDescLabel);

var oilSlider = Ti.UI.createSlider({
  top: 55,
  left: 10,
  width: 280,
  height: "auto",
  min: 0,
  max: 10,
  value:5,
  enabled: true
});
oilView.add(oilSlider);

oilSlider.addEventListener('change',function(e) {
	oilTitleLabel.text = "How Much Oil Do You See? (" + Math.round(oilSlider.value)+")";
});

scrollView.add(oilView);

// Wildlife
var wildView = Ti.UI.createView({
  top: 285,
  left: 10,
  width: 300,
  height: 90,
  backgroundColor:'#5a5c64',
  borderRadius:6
});
var wildTitleLabel = Ti.UI.createLabel({
  top: 5,
  left: 10,
  width: 300,
  height: 30,
  color: '#fff',
 font:{fontSize:18, fontWeight:'bold'},
  text:"Is There Wildlife Present?"
});
wildView.add(wildTitleLabel);

var html = "<html><body bgcolor='#5a5c64'>";
html += "<select id='wildlife_select' style='width: 270px; font-size: 14px; height: 30px;'>";
html += "<option value=\"No wildlife present\">No wildlife present</option>";
html += "<option value=\"Alive, no distress\">Alive, no distress</option>";
html += "<option value=\"Alive, some distress\">Alive, some distress</option>";
html += "<option value=\"Alive, very distressed\">Alive, very distressed</option>";
html += "<option value=\"Dead\">Dead</option>";
html += "</select>";
html += "<script type='text/javascript'>";
html += "document.getElementById('wildlife_select').onchange = function(){ Titanium.App.fireEvent('set_wildlife_value',{value:this.value}); };";
html += "</script>";
html +="</body></html>";

var wildWebView = Ti.UI.createWebView({
  top: 35,
  left: 0,
  width: (Ti.Platform.name != 'android' ? 290 : 300),
  height: (Ti.Platform.name != 'android' ? 44 : 48),
  html:html
});
wildView.add(wildWebView);
scrollView.add(wildView);


// Wetlands
var wetView = Ti.UI.createView({
  top: 385,
  left: 10,
  width: 300,
  height: 90,
  backgroundColor:'#5a5c64',
  borderRadius:6
});
var wetTitleLabel = Ti.UI.createLabel({
  top: 5,
  left: 10,
  width: 300,
  height: 30,
  color: '#fff',
	font:{fontSize:18, fontWeight:'bold'},
  text:"Impact to The Wetlands? (5)"
});
wetView.add(wetTitleLabel);

var wetDescLabel = Ti.UI.createLabel({
  top: (Ti.Platform.name == 'android' ? 30 : 25),
  left: 10,
  width: 300,
  height: 30,
  color: '#eee',
	font:{fontSize:12, fontWeight:'normal'},
  text:"0 is no impact, 10 is severe impact"
});
wetView.add(wetDescLabel);

var wetSlider = Ti.UI.createSlider({
  top: 55,
  left: 10,
  width: 280,
  height: "auto",
  min: 0,
  max: 10,
  value:5,
  enabled: true
});
wetView.add(wetSlider);

wetSlider.addEventListener('change',function(e) {
	wetTitleLabel.text = "Impact to The Wetlands? (" + Math.round(wetSlider.value)+")";
});

scrollView.add(wetView);

var reportShoreLabel = Ti.UI.createLabel({
  top: (Ti.Platform.name != 'android' ? 370 : 500),
  left: 0,
  width:320,
  font:{fontSize:14, fontWeight:'normal'},
  color:'#fff',
  textAlign:'center',
  text:'To report oiled shoreline call: \n(866) 448-5816\n\nTo report oiled wildlife call: \n(866) 557-1401'
});

scrollView.add(reportShoreLabel);


win.add(scrollView);

// Media management
var currentMedia = false;

var chooseMediaSource = function(event) {
  switch(event.index) {
    // case 0:
    //   newVideo();
    //   break;
    case 0:
      newPhoto();
      break;
    case 1:
      chooseFromGallery();
      break;
    case event.destructive:
      if(currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
        currentMedia = false;
      }
      break;
  };
};

var chooseMedia = Ti.UI.createOptionDialog({
  title: 'Choose media'
});
chooseMedia.addEventListener('click', chooseMediaSource);

function displayMediaChooser() {
  if(currentImageAdded) {
    chooseMedia.options = ['New Photo', 'Choose Existing', 'Remove Existing', 'Cancel'];
    chooseMedia.destructive = 2;  
    chooseMedia.cancel = 3;
  } else {
    chooseMedia.options = ['New Photo', 'Choose Existing','Cancel'];
    chooseMedia.cancel = 2;
  }
  chooseMedia.show();
}

function newVideo() {
  if(Ti.Platform.name == 'android') {
    Ti.UI.createAlertDialog({
		  title:'Sorry',
		  message:'Video submission is currently not supported for this device, yet.'
		}).show();
  }
  Ti.Media.showCamera({
    mediaTypes: [Ti.Media.MEDIA_TYPE_VIDEO],
    success: function(event) {
      var cropRect = event.cropRect;
      currentMedia = event.media;

      if(currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
      }
      
      Ti.UI.createAlertDialog({
      	title:'Video Added',
      	message:'Your video has been attached and is ready to be submitted.'
      }).show();


      currentImageView.addEventListener('click', function(event) {
        displayMediaChooser();
      });
      mediaButtonBg.add(currentImageView);
      currentImageAdded = true;
    },
		error:function(error) {
			Ti.UI.createAlertDialog({
			  title:'Sorry',
			  message:'This device cannot record videos.'
			}).show();
		},
		allowImageEditing:false,
		saveToPhotoGallery:true,
		videoMaximumDuration:10000,
		videoQuality:Titanium.Media.QUALITY_HIGH
  });
}

function newPhoto() {
  Ti.Media.showCamera({
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    success: function(event) {
      var cropRect = event.cropRect;
      currentMedia = event.media;

      if(currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
      }
      
      currentImageView = Ti.UI.createImageView({
                        top: 1,
                        left: 1,
                        image: event.media,
                        height: 44,
                        width: 44,
                        borderRadius: 2
                      });

      currentImageView.addEventListener('click', function(event) {
        displayMediaChooser();
      });
      mediaButtonBg.add(currentImageView);
      currentImageAdded = true;
    },
		error:function(error) {
			Ti.UI.createAlertDialog({
			  title:'Sorry',
			  message:'This device either cannot take photos or there was a problem saving this photo.'
			}).show();
		},
		allowImageEditing:true,
		saveToPhotoGallery:true
  });
}

function chooseFromGallery() {
  Ti.Media.openPhotoGallery({
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    success: function(event) {
      var cropRect = event.cropRect;
      currentMedia = event.media;

      if(currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
      }
      
      currentImageView = Ti.UI.createImageView({
                        top: 1,
                        left: 1,
                        image: event.media,
                        height: 44,
                        width: 44,
                        borderRadius: 2
                      });

      currentImageView.addEventListener('click', function(event) {
        displayMediaChooser();
      });
      mediaButtonBg.add(currentImageView);
      currentImageAdded = true;
    }
  });
};

var clearButton = Titanium.UI.createButton({title:'Clear'});
clearButton.addEventListener('click',function()	{
  var clearAlert = Titanium.UI.createAlertDialog({
  	title:'Clear All Values?',
  	message:'Are you sure you want to clear all the values in the fields below?'
  });
  clearAlert.buttonNames = ['Yes', 'No'];
	clearAlert.addEventListener("click",function(e) {
	  if(e.index == 0) {
      clearAllValues();
	  }
	});
	clearAlert.show();
});

if(Ti.Platform.name != 'android') {
 Titanium.UI.currentWindow.setLeftNavButton(clearButton);
}

function clearAllValues(){
  oilSlider.value = 5;
  wetSlider.value = 5;
  seeField.value = "";
  image = null;
  currentMedia = null;
  if(currentImageAdded) {
    mediaButtonBg.remove(currentImageView);
    currentImageAdded = false;
  }
}

function showSuccess() {
  if(Ti.Platform.name == 'android')
    androidActivityIndicator.hide();
    
  Ti.UI.createAlertDialog({
  	title:'Success!',
  	message:'Your report has been submitted.  Thank you!'
  }).show();
  clearAllValues();
}

var xhrOnError = function() {
  if(Ti.Platform.name == 'android')
    androidActivityIndicator.hide();
    
  Ti.App.fireEvent('hide_indicator',{});
  Ti.UI.createAlertDialog({
  	title:'Sorry',
  	message:'There was a problem submitting your oil report.  Please try again soon.'
  }).show();
};

Ti.App.addEventListener('submit_form', function(options) {
  if (options.latitude == null) { options.latitude = 0.0; }
  if (options.longitude == null) { options.longitude = 0.0; }

  var jsonData = JSON.stringify({ api_key          : api_key,
                                  description      : seeField.value,
                                  oil              : oilSlider.value,
                                  wetlands         : wetSlider.value,
                                  wildlife         : wildlifeValue,
                                  latitude         : options.latitude,
                                  longitude        : options.longitude,
                                  organization_pin : (properties.getString("orgPin") == null ? null : properties.getString("orgPin")),
                                  device_id        : Ti.Platform.id
                               });
                               
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = xhrOnError;

  xhr.onload = function() {
    Ti.API.info(this.responseText);
    Ti.API.info(this.status);
    if(this.status == 200) {
      Ti.API.info('Response ' + this.responseText);
      var reportId = false;

      reportId = JSON.parse(this.responseText).id;

      if (reportId && currentMedia) {
        Ti.App.fireEvent('upload_picture', { reportId: reportId });
      } else {
        if (!reportId) { Ti.API.error('Could not eval() responseText'); }
        Ti.App.fireEvent('hide_indicator',{});
        showSuccess();
      }      
    } else {
      if(Ti.Platform.name == 'android')
        androidActivityIndicator.hide();
        
      Ti.App.fireEvent('hide_indicator',{});
      Ti.UI.createAlertDialog({
      	title:'Sorry',
      	message:'There was a problem submitting your oil report.  Please try again soon.'
      }).show();
    }
  };
  
  Ti.API.info("About to submit ..." + jsonData);
  
  xhr.open('POST', hostname + '/reports');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(jsonData);
});

Ti.App.addEventListener('upload_picture', function(options) {
  if (options.reportId == null) {
    xhrOnError({ error: 'No report id' });
    return;
  }

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = xhrOnError;

  xhr.onload = function() {
    Ti.API.info(this.status);
    Ti.API.info('response' + this.responseText);
    Ti.App.fireEvent('hide_indicator', {});
    showSuccess();
  };
  
  var payload = { 
    "api_key": api_key,
    "media": currentMedia, 
    "_method": "PUT" 
  };
    
  xhr.open('PUT', hostname + '/reports/' + options.reportId);
  xhr.send(payload);
});

var submitButton = Titanium.UI.createButton({title:'Send'});

if(Ti.Platform.name != 'android') {
	Titanium.UI.currentWindow.setRightNavButton(submitButton);
}

submitButton.addEventListener('click', function() {
  submitReport();
});

function submitReport() {
  seeField.blur(); // Drop keyboard
  
  if (Titanium.Network.online == false){
  	Titanium.UI.createAlertDialog({
  	  title:"Connection Required",
  	  message:"We cannot detect a network connection.  You need an active network connection to be able to submit oil reports."
  	}).show();
  } else if(seeField.value != null && seeField.value != "" && seeField.value.length > 0) {
    if(Ti.Platform.name == 'android') {
      androidActivityIndicator = Titanium.UI.createActivityIndicator({message:'Submitting'});
      androidActivityIndicator.show();
    }
    Ti.App.fireEvent('show_indicator', { title: 'Locating' });

    if (Ti.Platform.name != 'android' && Ti.Geolocation.locationServicesEnabled == false) {
        Ti.App.fireEvent('hide_indicator',{});
        Titanium.UI.createAlertDialog({
      	  title:"Location Required",
      	  message:"Sorry, you need to have location services enabled to be able to submit reports."
      	}).show();
      	return;
    }
      
    Titanium.Geolocation.getCurrentPosition(function(e) {
      Ti.App.fireEvent('change_title', { title: 'Submitting' });
  		Ti.API.info("Received geolocation response");
    
  		if (e.error) {
  		  if(Ti.Platform.name == 'android') {
          androidActivityIndicator.hide();
        }
        
        Ti.App.fireEvent('hide_indicator',{});
      	Titanium.UI.createAlertDialog({
      	  title:"Location Required",
      	  message:"There was a problem trying to retrieve your location.  Please try again soon."
      	}).show();
  		} else {
  		  Ti.App.fireEvent('submit_form', { latitude: e.coords.latitude, longitude: e.coords.longitude });
      }
  	});
  } else {
    Ti.UI.createAlertDialog({
    	title:'Sorry!',
    	message:'You must make sure to at least let us know what you see in the field above before submitting.'
    }).show();
  }
}

//if(Ti.Platform.name == "android") {
//  var menu = Ti.UI.Android.OptionMenu.createMenu();
//  var clearMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({title : 'Clear Form'});
//  clearMenuItem.addEventListener('click', function(){
//    var clearAlert = Titanium.UI.createAlertDialog({
//    	title:'Clear All Values?',
//    	message:'Are you sure you want to clear all the values in the fields below?'
//    });
//    clearAlert.buttonNames = ['Yes', 'No'];
 // 	clearAlert.addEventListener("click",function(e) {
//  	  if(e.index == 0) {
 //       clearAllValues();
//  	  }
//  	});
//  	clearAlert.show();
//  });
//  var submitMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({
//      title : 'Submit Report'
//  });
//  submitMenuItem.addEventListener('click', function(){
//    submitReport();
 // });
//
//  menu.add(clearMenuItem);
//  menu.add(submitMenuItem);
//  Ti.UI.Android.OptionMenu.setMenu(menu); 
//}

Ti.App.fireEvent('hide_indicator');

Ti.App.addEventListener("set_wildlife_value",function(e){
  wildlifeValue = e.value;
});