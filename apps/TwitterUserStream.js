'use strict'

var Twitter = require('twitter');

/*
* Gets a stream from Twitter.
*/
const Base = require('./Base.js');

let TwitterUserStream = class TwitterUserStream extends Base {
  constructor(config) {
    config = Object.assign({
      consumerKey: '',
      consumerSecret: '',
      accessTokenKey: '',
      accessTokenSecret: '',
      streamParameters: {},
      numTweetsToStore: 10
    }, config);

    super(config);

    this.validateConfig([
      "consumerKey",
      "consumerSecret",
      "accessTokenKey",
      "accessTokenSecret"
    ]);

    this.client = new Twitter({
      consumer_key: this._config.consumerKey,
      consumer_secret: this._config.consumerSecret,
      access_token_key: this._config.accessTokenKey,
      access_token_secret: this._config.accessTokenSecret
    });

    this.stream = this.client.stream('user', this._config.streamParameters);

    this.stream.on('data', this.handleStreamData.bind(this));
    this.stream.on('error', this.handleStreamError.bind(this));

    this.tweets = [];
  }

  handleStreamData(event) {
    if (!('created_at' in event)) {
      return;
    }

    console.log('got tweet: ' + event.id_str);

    var self = this;
    this.client.get('statuses/oembed.json', {id: event.id_str}, function(err, embed) {
      console.log(embed);

      event.oembed = embed;

      self.tweets.unshift(event);
      self.tweets = self.tweets.slice(0,self._config.numTweetsToStore);

      self.setState({
        tweets: self.tweets,
        lastTweet: self.tweets[0]
      });
    })

  }

  handleStreamError(error) {
    throw error;
  }
}

module.exports = TwitterUserStream;
