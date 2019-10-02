const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    if (options.encoding === 'utf-8' ||
        options.encoding === 'utf8') {
      options = {...options, ...{decodeStrings: false}};
    }
    super(options);
    this.encoding = options.encoding.replace('-', '');
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    if (encoding !== this.encoding) throw new TypeError('not UTF-8');
    this.buffer +=chunk; 
    if (this.buffer.includes(os.EOL)) {
      const arrayFromBuffer = this.buffer.split(os.EOL);
      arrayFromBuffer.filter((item, index) => index < arrayFromBuffer.length - 1).forEach(i => this.push(i))
      this.buffer = arrayFromBuffer.filter((item, index) => index === arrayFromBuffer.length - 1).join('');
    }
    callback();
  }

  _flush(callback) {
    if (this.buffer) {
      callback(null, this.buffer);
    }
  }
}

module.exports = LineSplitStream;
