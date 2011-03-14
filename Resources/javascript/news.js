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

win.add(scrollView);

Ti.App.fireEvent('hide_indicator');
