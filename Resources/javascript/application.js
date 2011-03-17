var DEFAULT_BAR_COLOR = "#000";

// Set orientation
//Ti.UI.orientation = Ti.UI.PORTRAIT;

function noNetworkAlert() {
    Ti.App.fireEvent('hide_indicator',{});
  	Ti.UI.createAlertDialog({
  	  title:Ti.Locale.getString('twitter_no_network_title'),
  	  message:Ti.Locale.getString('twitter_no_network_msg')
  	}).show();	
};

function isAndroid(){
	return (Ti.Platform.name == 'android');
};