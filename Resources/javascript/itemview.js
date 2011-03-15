var win = Titanium.UI.currentWindow
Ti.API.info("Loaded itemview.js");

Ti.include('./strip_tags.js');

// Header for title, author and published date
var item_header_view = Ti.UI.createView({
    backgroundColor: '#c1c1c1',
    top: 0,
    height: '80'
});

var item_title_label = Ti.UI.createLabel({
    text: '',
    //backgroundColor: '',
    color: '#000',
    //textAlign: 'center',
    left: 10,
    right: 10,
    top: 5,
    //height: 45,
    font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 14}
});


var item_pubDate_label = Ti.UI.createLabel({
    text: '',
    color: '#000',
    left: 10,
    right: 10,
    top: 60,
    font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 12}
});

var item_desc_label = Ti.UI.createLabel({
    text: '',
    color: '#000',
    textAlign: 'left',
    left: 10,
    right: 10,
    top: 80,
    font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 12}
});

var item_link_label = Ti.UI.createLabel({
    text: '',
    color: '#0b0b61',
    textAlign: 'center',
    left: 10,
    right: 10,
    bottom: 20,
    font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 12}
});

win.add(item_header_view);
item_title_label.text = strip_tags(win.thisTitle);
win.add(item_title_label);
item_pubDate_label.text = strip_tags(win.thisPubDate);
win.add(item_pubDate_label);
item_desc_label.text = strip_tags(win.thisDesc);
win.add(item_desc_label);
item_link_label.text = "Read More...";
item_link_label.url = strip_tags(win.thisLink);
win.add(item_link_label);

item_link_label.addEventListener('click', function (e) {
    Ti.Platform.openURL(item_link_label.url);
});
