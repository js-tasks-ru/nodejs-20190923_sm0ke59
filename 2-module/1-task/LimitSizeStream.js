const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding || 'utf-8';
    this.bytes = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bytes += chunk.length;
    if (this.bytes > this.limit) {
      callback( new LimitExceededError() );
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
