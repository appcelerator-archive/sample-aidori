var DEFAULT_BAR_COLOR = "#000";
var TWITTER_ACCOUNT = 'prayforjapan';

// Set orientation
//Ti.UI.orientation = Ti.UI.PORTRAIT;

function noNetworkAlert() {
    Ti.App.fireEvent('hide_indicator',{});
  	Titanium.UI.createAlertDialog({
  	  title:Ti.Locale.getString('twitter_no_network_title'),
  	  message:Ti.Locale.getString('twitter_no_network_msg')
  	}).show();	
};