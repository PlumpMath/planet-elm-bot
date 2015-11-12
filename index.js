
var twitter = require('simple-twitter');

twitter = new twitter( 'x' //consumer key from twitter api
					 , 'x' //consumer secret key from twitter api
					 , 'x' //access token from twitter api 
					 , 'x',
					 3600); //access token secret from twitter api 


var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('Planet Elm Bot\n');
}).listen(8080);

var timeInterval = 100000; // run every 10m
var timerVar = setInterval (function () {runBot()}, timeInterval); 

function runBot(){
	var dateNow = new Date();
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
			var lastRun = dateNow - timeInterval;

			if (item.date > lastRun){
				var titleLength = item.title.length;
				var itemTitle = item.title;

				if (titleLength > 100) {
					itemTitle = itemTitle.substring(0, 100);
				}

				twitter.post('statuses/update'
		                    , {'status' : itemTitle + ' ' + item.link + " #elmlang"}
		                    , function (error, data) {
		                        console.dir(data);
		                    });
			}
		}
	});
	var dateCompleted = new Date();
	console.log('loop completed at ' + dateCompleted);
}
