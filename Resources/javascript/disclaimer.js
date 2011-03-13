Titanium.include('./application.js');
var win = Ti.UI.currentWindow;
var properties = Ti.App.Properties;

var bgImage = Ti.UI.createImageView({
  top:0,
  left:0,
  height:'auto',
  width:'auto'
});
win.add(bgImage);

var scrollView = Ti.UI.createScrollView({
  top: 0,
  left: 0,
  contentHeight: 'auto',
  contentWidth: 320
});

var disclaimerLabel = Ti.UI.createLabel({
  top: 10,
  left: 10,
  width: 300,
  height: 'auto',
  color: '#fff',
	font:{fontSize:13, fontWeight:'normal'},
  text: "CrisisCommons, along with our friends in the greater volunteer technology community, stands ready to provide opportunities to volunteers of all skills levels to contribute to support requests made by crisis response agencies such as UN OCHA, Red Cross or local emergency management in support of their response and recovery efforts to response to 2011 Sendai earthquake and the subsequent tsunami that has affected countries across the Pacific region." +
        "Personal privacy. Your personal information will not be collected on this application. We encourage thoughtful reporting. Data retrieved on this application will be monitored. As a reminder, your location and the data you submit will be made public.\n\n" +
        "If you at any time wish to contact CrisisCommons, please email us at NEED_EMAIL_ADDRESS@crisiscommons.org\n\n" +
        "Privacy Statement (crisiscommons.org/privacy)\n\nTerms of Service (crisiscommons.org/tos)"
});
scrollView.add(disclaimerLabel);

var tosButton = Ti.UI.createButton({
  width: 301,
  height: 57,
  top: (Ti.Platform.name == 'android' ? 630 : 620),
  backgroundImage: '../images/button_dark_off.png',
  backgroundSelectedImage: '../images/button_dark_on.png',
	font:{fontSize:16, fontWeight:'bold'},
	color:"#fff",
  title: 'I Accept'
});
tosButton.addEventListener('click', function() {
  if(orgField.getValue() != null && orgField.getValue().length > 0) {
    properties.setString("orgPin",orgField.getValue());
  }
  Ti.App.fireEvent('remove_disclaimer');
});
scrollView.add(tosButton);

win.add(scrollView);
