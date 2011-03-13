Titanium.include('./application.js');
var win = Ti.UI.currentWindow;

var aboutImage = Ti.UI.createImageView({
  top:0,
  left:0,
  url:'../images/about.png',
  height:430,
  width:320
});
win.add(aboutImage);

Ti.App.addEventListener("openURL", function(e){
  Ti.Platform.openURL(e.url);
});

var  html = "<p>Oil Reporter was built by <a href=\"javascript:Ti.App.fireEvent('openURL',{url:'http://intridea.com'});\" style='color:#000060; font-weight:bold;'>Intridea</a> for <a href=\"javascript:Ti.App.fireEvent('openURL',{url:'http://crisiscommons.org'});\" style='color:#000060; font-weight:bold;'>CrisisCommons</a> " +
            "to provide trained response volunteers and citizens with   " +
            "an opportunity to share what they see via their mobile     " +
            "phone and for that data to be shared back to the public.</p> " +
            "                                                           " +
            "<p>On April 20, 2010, an explosion occurred on the semi-   " +
            "submersible offshore drilling rig Deepwater Horizon in     " +
            "the Gulf of Mexico.In the days after, it was found that    " +
            "the damage in the explosion caused a wellhead to fail and  " +
            "lead to the leaking of oil into the Gulf.</p>              " +
            "                                                           " +
            "<p>Oil Reporter enables trained volunteers and citizens to " +
            "report \"What they see\" on their property or apart of a   " +
            "volunteer team assessment. Volunteers and citizens can     " +
            "upload photos, videos, text and provide contextual         " +
            "information regarding what they are observing. Through     " +
            "GPS enabled smart phones like this one, submissions        " +
            "will be able to be geolocated onto a map and shared        " +
            "back to the public via a public data feed on               " +
            "<a href=\"javascript:Ti.App.fireEvent('openURL',{url:'http://oilreporter.org/reports'});\" style='color:#000060; font-weight:bold;'>oilreporter.org/reports</a> so that response " +
            "organizations can use this data for better understanding   " +
            "of needs andresponse operations. This application will provide the opportunity for organizations to share public data and create products and tools for the oil spill response.</p>" +
            "                                                           " +
            "<p>CrisisCommons is a global network of volunteers who use creative        " +
            "roblem solving and open technologies to help people in times and places of crisis. " +
            "Find out more about our work at <a href=\"javascript:Ti.App.fireEvent('openURL',{url:'http://crisiscommons.org'});\" style='color:#000060; font-weight:bold;'>www.crisiscommons.org</a></p>";

var webView = Ti.UI.createWebView({
  top: 0,
  left: 0,
  width: 320,
  height: (Titanium.Platform.name == 'android' ? (Titanium.Platform.displayCaps.platformHeight-90) :370),
  backgroundColor:'transparent',
  html: "<html><body style='padding: 10px; font-size:14px;color:#fff;font-family:sans-serif;'>"+html+'</body></html>'
});

win.add(webView)