
/*!
 * querystring
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.1.0';

/**
 * Parse the given query `str`, returning an object.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str) {
  if (str == undefined || str == '') return {};

  return String(str)
    .split('&')
    .reduce(function(ret, pair){
      var pair = decodeURIComponent(pair.replace(/\+/g, ' '))
        , eql = pair.indexOf('=')
        , brace = lastBraceInKey(pair)
        , key = pair.substr(0, brace || eql)
        , val = pair.substr(brace || eql, pair.length)
        , val = val.substr(val.indexOf('=') + 1, val.length)
        , obj = ret;

      // ?foo
      if ('' == key) key = pair, val = '';

      // nested
      if (~key.indexOf(']')) {

        var parts = key.split('[')
          , len = parts.length
          , last = len - 1;

        function parse(obj, parts, parent, key) {
          var part = parts.shift();

          // end
          if (!part) {
            if (Array.isArray(parent[key])) {
              parent[key].push(val);
            } else if ('object' == typeof parent[key]) {
              parent[key] = val;
            } else {
              parent[key] = [parent[key], val];
            }
          // array
          } else if (']' == part || ('0]' == part && JSON.stringify(obj) == '{}')) {
            // existing array, append to it
            if (Array.isArray(parent[key])) {
              obj = parent[key];
            } else {
              obj = [];
              // was an object, but parser found out it was actually an array!
              // preserve any named indices if we can
              if (parent[key]) {
                for(var field in parent[key]) {
                  obj[field] = parent[key][field];  
                }
              }
            }

            parent[key] = obj;

            // if there are more parts, we need to continue parsing
            if (parts.length) {
              // if obj is an empty array, push a new object into in
              if (!obj.length || typeof(obj[obj.length - 1]) != 'object') obj.push({});

              // the new obj is the last one in this array
              parse(obj[obj.length - 1], parts, obj, part);
            } else if ('' != val) {
              obj.push(val);
            }

          // prop
          } else if (~part.indexOf(']')) {
            part = part.substr(0, part.length - 1);

            // does object already have property AND parent is a nested array
            if (obj[part] && Array.isArray(parent)) {
              var left = parts.length;

              // are there no more parts OR 
              // is the last part not a '[]' AND the next part already exists as a previously parsed property
              if (!left || (parts[left - 1] != ']' && obj[part][parts[0].slice(0, -1)] !== undefined)) {
                parent.push(obj = {});
              }
            }
  
            parse(obj[part] = obj[part] || {}, parts, obj, part);

          // key
          } else {
            parse(obj[part] = obj[part] || {}, parts, obj, part);
          }
        }

        parse(obj, parts);
      // optimize
      } else {
        set(obj, key, val);
      }

      return ret;
    }, {});
};

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (Array.isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}
