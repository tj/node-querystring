
/**
 * Module dependencies.
 */

var qs = require('./');

var obj = qs.parse('foo');
require('util').inspect(obj)

var obj = qs.parse('foo=bar=baz');
require('util').inspect(obj)

var obj = qs.parse('users[]');
require('util').inspect(obj)

var obj = qs.parse('name=tj&email=tj@vision-media.ca');
require('util').inspect(obj)

var obj = qs.parse('users[]=tj&users[]=tobi&users[]=jane');
require('util').inspect(obj)

var obj = qs.parse('user[name][first]=tj&user[name][last]=holowaychuk');
require('util').inspect(obj)

var obj = qs.parse('users[][name][first]=tj&users[][name][last]=holowaychuk');
require('util').inspect(obj)

var obj = qs.parse('a=a&a=b&a=c');
require('util').inspect(obj)

var obj = qs.parse('user[tj]=tj&user[tj]=TJ');
require('util').inspect(obj)

var obj = qs.parse('user[names]=tj&user[names]=TJ&user[names]=Tyler');
require('util').inspect(obj)

var obj = qs.parse('user[name][first]=tj&user[name][first]=TJ');
require('util').inspect(obj)
