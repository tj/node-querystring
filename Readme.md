# node-querystring [![Build Status](https://travis-ci.org/visionmedia/node-querystring.png?branch=master)](https://travis-ci.org/visionmedia/node-querystring)

  query string parser for node and the browser supporting nesting, as it was removed from `0.3.x`, so this library provides the previous and commonly desired behaviour (and twice as fast). Used by [express](http://expressjs.com), [connect](http://senchalabs.github.com/connect) and others.

## Installation

    $ npm install qs

## Examples

```js
var qs = require('qs');

qs.parse('user[name][first]=Tobi&user[email]=tobi@learnboost.com');
// => { user: { name: { first: 'Tobi' }, email: 'tobi@learnboost.com' } }

qs.stringify({ user: { name: 'Tobi', email: 'tobi@learnboost.com' }})
// => user[name]=Tobi&user[email]=tobi%40learnboost.com
```

## Testing

Install dev dependencies:

    $ npm install -d

and execute:

    $ make test

browser:

    $ open test/browser/index.html
