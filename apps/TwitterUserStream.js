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
    this.tweets.unshift(event);
    this.tweets = this.tweets.slice(0,this._config.numTweetsToStore);

    this.setState({
      tweets: this.tweets,
      lastTweet: this.tweets[0]
    });
  }

  handleStreamError(error) {
    throw error;
  }
}

module.exports = TwitterUserStream;
