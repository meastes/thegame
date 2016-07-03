/* eslint-disable */
require('babel-register');
var process = require('process');

process.on('uncaughtException', function(err) {
    console.log(err);
});
module.exports = require('./point-retriever');
