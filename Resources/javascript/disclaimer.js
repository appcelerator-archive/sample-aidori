Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){

	cc.scrollView = Ti.UI.createScrollView({id:'scrollView'});
	cc.disclaimerLabel = Ti.UI.createLabel({id:'disclaimerLabel'});
	cc.scrollView.add(cc.disclaimerLabel);

	cc.win.add(cc.scrollView);

	cc.okButton = Ti.UI.createView({
	  borderRadius:isAndroid() ? 10 : 5,
	  id:'okButton'
	});
	
	cc.win.add(cc.okButton);
	
	cc.okButtonLabel = Ti.UI.createLabel({
		text:L('disclaimer_button_title'),
		right:10,
		left:10,
		textAlign:'center',
		color:'#fff',
		font:{
			fontSize:20,fontWeight:'Bold'
		}
		
	});
	cc.okButton.add(cc.okButtonLabel);
		
	cc.okButton.addEventListener('click', function() {
	 	Ti.App.Properties.setBool('disclaimerViewed', true);
		cc.win.close();
	});
				
})();











