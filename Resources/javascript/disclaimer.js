Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){

	cc.bgImage = Ti.UI.createImageView({
	  top:0,
	  left:0,
	  height:'auto',
	  width:'auto'
	});
	cc.win.add(cc.bgImage);

	cc.scrollView = Ti.UI.createScrollView({
	  top: 0,
	  left: 0,
	  bottom:65,
	  contentHeight: 'auto',
	  contentWidth: 320
	});

	Ti.API.info(Ti.Locale.getString('disclaimer_text'));
	cc.disclaimerLabel = Ti.UI.createLabel({id:'disclaimerLabel'});
	cc.scrollView.add(cc.disclaimerLabel);

	cc.win.add(cc.scrollView);

	cc.tosButton = Ti.UI.createButton({id:'tosButton'});
	cc.win.add(cc.tosButton);
		
	cc.tosButton.addEventListener('click', function() {
	  Ti.App.fireEvent('remove_disclaimer');
	});
				
})();











