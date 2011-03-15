Titanium.include('./keys.js');
Titanium.include('./application.js');

var win = Ti.UI.currentWindow;

Ti.App.fireEvent('show_indicator');

var data = [
    {title:'All content', controller: '', rss:''},
    {title:'BBC - English', controller: './feedreader.js', rss:'feed://feeds.bbci.co.uk/news/world/asia_pacific/rss.xml'},
    //{title:'Linux.com original content', controller: '', rss:''},
    {title:'BBC - Video', controller: './feedreader.js', rss:'http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml'},
    {title:'毎日ｊｐ-ニュース速報', controller: './feedreader.js', rss:'http://mainichi.jp/rss/etc/flash.rss'},
    {title:'asahi.com', controller: './feedreader.js', rss:'http://www3.asahi.com/rss/index.rdf'},
    {title:'YOMIURI ONLINE', controller: './feedreader.js', rss:'http://rss.yomiuri.co.jp/f/yol_topstories'},
    {title:'MSN産経ニュース', controller: './feedreader.js', rss:'http://sankei.jp.msn.com/rss/news/points.xml'},
    {title:'CNN.co.jp', controller: './feedreader.js', rss:'http://feeds.cnn.co.jp/cnn/rss'},
    {title:'災害対策', controller: './feedreader.js', rss:'http://saigaitaisaku.r-cms.biz/files/topics/rss/group4.rdf'},
    {title:'Googleニュース', controller: './feedreader.js', rss:'http://blogsearch.google.co.jp/blogsearch_feeds?hl=ja&amp;q=震災&amp;lr=lang_ja&amp;ie=utf-8&amp;num=10&amp;output=rss'}    
];

var template = {
    selectedBackgroundColor:'#fff',
    backgroundColor:'#ffffff',
    rowHeight:100,
    layout:[
        {type:'image', left:10, top:5, width:50, height:50, name:'photo'},
        {type:'text', fontSize:16, fontWeight:'bold', fontFamily:'Arial', left:70, top:2, width:200, height:30, color:'#000000', name:'user'},
        {type:'image', right:5, top:35, width:36, height:34, name:'button'},
   ]
};

var tableView = Titanium.UI.createTableView({
    data:data,
    template:template
});

// Create tableView row event listener
tableView.addEventListener('click', function (e) {
    if (e.rowData.controller) {
        Ti.API.info('click fired: ' + e.rowData.title + ' ' + e.rowData.controller);
        var win = Titanium.UI.createWindow({
            url:e.rowData.controller,
            title:e.rowData.title
        });
        win.rss = e.rowData.rss;
        Titanium.UI.currentTab.open(win,{animated:true});
    }
});

Titanium.UI.currentWindow.add(tableView);

Ti.App.fireEvent('hide_indicator');
