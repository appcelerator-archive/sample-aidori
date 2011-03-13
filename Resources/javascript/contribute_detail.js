var cc ={win:Ti.UI.currentWindow};
(function(){

	cc.doneButton = Ti.UI.createButton({systemButton:Ti.UI.iPhone.SystemButton.DONE});
	if(Ti.Platform.name != 'android'){
		cc.win.rightNavButton=cc.doneButton;
	}
	

})();

//------------------------------
//	Events
//------------------------------
cc.doneButton.addEventListener('click', function(){
	cc.win.close();
});