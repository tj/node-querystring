
/**
 * Module dependencies.
 */

var qs = require('../')
  , should = require('should');

module.exports = {
  'test basics': function(){
    qs.parse('0=foo').should.eql({ '0': 'foo' });

    qs.parse('foo=c++')
      .should.eql({ foo: 'c  ' });

    qs.parse('a[>=]=23')
      .should.eql({ a: { '>=': '23' }});

    qs.parse('a[<=>]==23')
      .should.eql({ a: { '<=>': '=23' }});

    qs.parse('a[==]=23')
      .should.eql({ a: { '==': '23' }});

    qs.parse('foo')
      .should.eql({ foo: '' });

    qs.parse('foo=bar')
      .should.eql({ foo: 'bar' });

    qs.parse('foo%3Dbar=baz')
      .should.eql({ foo: 'bar=baz' });

    qs.parse(' foo = bar = baz ')
      .should.eql({ ' foo ': ' bar = baz ' });

    qs.parse('foo=bar=baz')
      .should.eql({ foo: 'bar=baz' });

    qs.parse('foo=bar&bar=baz')
      .should.eql({ foo: 'bar', bar: 'baz' });

    qs.parse('foo=bar&baz')
      .should.eql({ foo: 'bar', baz: '' });

    qs.parse('cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World')
      .should.eql({
          cht: 'p3'
        , chd: 't:60,40'
        , chs: '250x100'
        , chl: 'Hello|World'
      });
  },
  
  'test nesting': function(){
    qs.parse('ops[>=]=25')
      .should.eql({ ops: { '>=': '25' }});

    qs.parse('user[name]=tj')
      .should.eql({ user: { name: 'tj' }});

    qs.parse('user[name][first]=tj&user[name][last]=holowaychuk')
      .should.eql({ user: { name: { first: 'tj', last: 'holowaychuk' }}});
  },
  
  'test escaping': function(){
    qs.parse('foo=foo%20bar')
      .should.eql({ foo: 'foo bar' });
  },
  
  'test arrays': function(){
    qs.parse('images[]')
      .should.eql({ images: [] });

    qs.parse('user[]=tj')
      .should.eql({ user: ['tj'] });

    qs.parse('user[]=tj&user[]=tobi&user[]=jane')
      .should.eql({ user: ['tj', 'tobi', 'jane'] });

    qs.parse('user[names][]=tj&user[names][]=tyler')
      .should.eql({ user: { names: ['tj', 'tyler'] }});

    qs.parse('user[names][]=tj&user[names][]=tyler&user[email]=tj@vision-media.ca')
      .should.eql({ user: { names: ['tj', 'tyler'], email: 'tj@vision-media.ca' }});

    qs.parse('items=a&items=b')
      .should.eql({ items: ['a', 'b'] });

    qs.parse('user[names]=tj&user[names]=holowaychuk&user[names]=TJ')
      .should.eql({ user: { names: ['tj', 'holowaychuk', 'TJ'] }});

    qs.parse('user[name][first]=tj&user[name][first]=TJ')
      .should.eql({ user: { name: { first: ['tj', 'TJ'] }}});
  },
  
  'test right-hand brackets': function(){
    qs.parse('pets=["tobi"]')
      .should.eql({ pets: '["tobi"]' });

    qs.parse('operators=[">=", "<="]')
      .should.eql({ operators: '[">=", "<="]' });

    qs.parse('op[>=]=[1,2,3]')
      .should.eql({ op: { '>=': '[1,2,3]' }});

    qs.parse('op[>=]=[1,2,3]&op[=]=[[[[1]]]]')
          .should.eql({ op: { '>=': '[1,2,3]', '=': '[[[[1]]]]' }});
  },
  
  'test duplicates': function(){
    qs.parse('items=bar&items=baz&items=raz')
      .should.eql({ items: ['bar', 'baz', 'raz'] });
  },

  'test empty': function(){
    qs.parse('').should.eql({});
    qs.parse(undefined).should.eql({});
    qs.parse(null).should.eql({});
  },

  'test complex': function(){

     // if no arrays are EVER specified, parser will create arrays for you
    qs.parse('users[name][first]=tj&users[name][first]=tobi')
        .should.eql({
          users: { name: { first: [ 'tj', 'tobi' ] } }
        });

    // once an array is specified, objects that are parsed are PUSHED onto the array
    qs.parse('users[][name][first]=tj&users[][name][first]=tobi')
        .should.eql({
          users: [ { name: { first: 'tj' } }, { name: { first: 'tobi' } } ]
        });

    // arrays can be specified within objects
    qs.parse('users[name][][first]=tj&users[name][][first]=tobi')
        .should.eql({
          users: { name: [ { first: 'tj' }, { first: 'tobi' } ] }
        });

    // if you specify an array but want a deeper object to be pushed into a deeper array, you can specify that with []
     qs.parse('users[][name][first][]=tj&users[][name][first][]=tobi')
        .should.eql({
          users: [ { name: { first: [ 'tj', 'tobi' ] } } ]
        });

    // you can continue adding to a deep object object
    qs.parse('users[][name][first]=tj&users[][name][last]=holowaychuk')
        .should.eql({
          users: [ { name: { first: 'tj', last: 'holowaychuk' } } ]
        });

    // order matters, once a new object is pushed, you can't add anything back into the youngest object
    qs.parse('users[][name][first]=tobi&users[][name][first]=tj&users[][name][last]=holowaychuk')
        .should.eql({
          users: [ { name: { first: 'tobi' } }, { name: { first: 'tj', last: 'holowaychuk' } } ]
        });
  },

  'test deep': function(){
    // deep objects should work
    qs.parse('users[][name][first][nickname]=tj&users[][name][first][nickname]=tobi')
       .should.eql({
         users: [ { name: { first: { nickname: 'tj' } } }, { name: { first: { nickname: 'tobi' } } } ]
       });

    // deep objects should work 
    qs.parse('users[][name][first][nickname][]=tj&users[][name][first][nickname][]=tobi')
       .should.eql({
         users: [ { name: { first: { nickname: [ 'tj', 'tobi' ] } } } ]
       });
  },

  'test deep complex': function() {
     // deep objects should work
     qs.parse('a[b][][c]=1&a[b][]=2&a[b][]=3&a[b][][d]=4')
         .should.eql({
            a: { b : [ { c: 1 }, 2, 3, { d: 4 } ] }
       });
  },

  'indice types': function() {
    // numbered indice starting with 0 or [] means we want an array
     qs.parse('a[0]=1')
         .should.eql({
        a: [1]
       }).obj.a.should.be.an.instanceof(Array);

    // without [0] or [], means we want an object
     qs.parse('a[1]=2')
         .should.eql({
        a: { 1: 2 }
       }).obj.a.should.be.a('object');

     // [] triggers the array creation, no matter what, it will push from last indice that it can
     qs.parse('a[8]=1&a[]=2&a[2]=3&a[500]=4')
         .should.eql({
        a: {2:3, 8:1, 9:2, 500:4}
       }).obj.a.should.be.an.instanceof(Array);

    // arrays can have named indices!?
     qs.parse('a[foo]=bar&a[]=2')
         .should.eql({
        a: { foo: 'bar', 0: 2}
       }).obj.a.should.be.an.instanceof(Array);

    // no [] or [0], then we have an object, no matter what
     qs.parse('a[foo]=bar&a[1]=2')
         .should.eql({
        a: { foo: 'bar', 1: 2}
       }).obj.a.should.be.a('object');
  }
};
