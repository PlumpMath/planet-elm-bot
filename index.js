
var twitter = require('simple-twitter');

twitter = new twitter('x', 'x', 'x', 'x');

var FeedParser = require('feedparser');
var request = require('request');

var req = request('https://live-planet-elm.pantheon.io/feeds.xml');
var feedparser = new FeedParser();

req.on('error', function (error) {
	console.log(error);
});

req.on('response', function (res){
	var stream = this;

	if (res.statusCode != 200 ) return this.emit('error', new Error('Bad status code'));
	stream.pipe(feedparser);
});

feedparser.on('error', function(error) {  
    console.log(error);
});

feedparser.on('readable', function() {  
	//TODO: put stuff here
	var stream = this;
	var meta = this.meta;

	var item;

	while (item = stream.read()) {
		var titleLength = item.title.length;
		var itemTitle = item.title;

		if (titleLength > 100) {
			itemTitle = itemTitle.substring(0, 100);
		}

		console.log(itemTitle, item.link, " #elmlang" );
	}
})
