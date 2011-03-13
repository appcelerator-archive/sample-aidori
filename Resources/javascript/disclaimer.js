Ti.include('./application.js');
var cc ={win:Ti.UI.currentWindow};
(function(){

	cc.bgImage = Ti.UI.createImageView({id:'bgImage'});
	cc.win.add(cc.bgImage);
	cc.scrollView = Ti.UI.createScrollView({id:'scrollView'});
	cc.disclaimerLabel = Ti.UI.createLabel({id:'disclaimerLabel'});
	cc.scrollView.add(cc.disclaimerLabel);

	cc.win.add(cc.scrollView);

	cc.tosButton = Ti.UI.createButton({id:'tosButton'});
	cc.win.add(cc.tosButton);
		
	cc.tosButton.addEventListener('click', function() {
	  Ti.App.fireEvent('remove_disclaimer');
	});
				
})();











