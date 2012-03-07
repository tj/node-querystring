
if ('function' == typeof require) {
  var qs = require('../')
    , expect = require('expect.js');
}

describe('qs.parse()', function(){
  it('should support the basics', function(){
    expect(qs.parse('0=foo')).to.eql({ '0': 'foo' });

    expect(qs.parse('foo=c++'))
      .to.eql({ foo: 'c  ' });

    expect(qs.parse('a[>=]=23'))
      .to.eql({ a: { '>=': '23' }});

    expect(qs.parse('a[<=>]==23'))
      .to.eql({ a: { '<=>': '=23' }});

    expect(qs.parse('a[==]=23'))
      .to.eql({ a: { '==': '23' }});

    expect(qs.parse('foo'))
      .to.eql({ foo: '' });

    expect(qs.parse('foo=bar'))
      .to.eql({ foo: 'bar' });

    expect(qs.parse('foo%3Dbar=baz'))
      .to.eql({ foo: 'bar=baz' });

    expect(qs.parse(' foo = bar = baz '))
      .to.eql({ ' foo ': ' bar = baz ' });

    expect(qs.parse('foo=bar=baz'))
      .to.eql({ foo: 'bar=baz' });

    expect(qs.parse('foo=bar&bar=baz'))
      .to.eql({ foo: 'bar', bar: 'baz' });

    expect(qs.parse('foo=bar&baz'))
      .to.eql({ foo: 'bar', baz: '' });

    expect(qs.parse('cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World'))
      .to.eql({
          cht: 'p3'
        , chd: 't:60,40'
        , chs: '250x100'
        , chl: 'Hello|World'
      });
  })

  it('should support nesting', function(){
    expect(qs.parse('ops[>=]=25'))
      .to.eql({ ops: { '>=': '25' }});

    expect(qs.parse('user[name]=tj'))
      .to.eql({ user: { name: 'tj' }});

    expect(qs.parse('user[name][first]=tj&user[name][last]=holowaychuk'))
      .to.eql({ user: { name: { first: 'tj', last: 'holowaychuk' }}});
  })

  it('should support array notation', function(){
    expect(qs.parse('images[]'))
      .to.eql({ images: [] });

    expect(qs.parse('user[]=tj'))
      .to.eql({ user: ['tj'] });

    expect(qs.parse('user[]=tj&user[]=tobi&user[]=jane'))
      .to.eql({ user: ['tj', 'tobi', 'jane'] });

    expect(qs.parse('user[names][]=tj&user[names][]=tyler'))
      .to.eql({ user: { names: ['tj', 'tyler'] }});

    expect(qs.parse('user[names][]=tj&user[names][]=tyler&user[email]=tj@vision-media.ca'))
      .to.eql({ user: { names: ['tj', 'tyler'], email: 'tj@vision-media.ca' }});

    expect(qs.parse('items=a&items=b'))
      .to.eql({ items: ['a', 'b'] });

    expect(qs.parse('user[names]=tj&user[names]=holowaychuk&user[names]=TJ'))
      .to.eql({ user: { names: ['tj', 'holowaychuk', 'TJ'] }});

    expect(qs.parse('user[name][first]=tj&user[name][first]=TJ'))
      .to.eql({ user: { name: { first: ['tj', 'TJ'] }}});

    var o = qs.parse('existing[fcbaebfecc][name][last]=tj')
    expect(o).to.eql({ existing: { 'fcbaebfecc': { name: { last: 'tj' }}}})
    expect(Array.isArray(o.existing)).to.equal(false);
  })

  it('should support arrays with indexes', function(){
    expect(qs.parse('foo[0]=bar&foo[1]=baz')).to.eql({ foo: ['bar', 'baz'] });
    expect(qs.parse('foo[1]=bar&foo[0]=baz')).to.eql({ foo: ['baz', 'bar'] });
    expect(qs.parse('foo[base64]=RAWR')).to.eql({ foo: { base64: 'RAWR' }});
    expect(qs.parse('foo[64base]=RAWR')).to.eql({ foo: { '64base': 'RAWR' }});
  })

  it('should expand to an array when dupliate keys are present', function(){
    expect(qs.parse('items=bar&items=baz&items=raz'))
      .to.eql({ items: ['bar', 'baz', 'raz'] });
  })

  it('should support right-hand side brackets', function(){
    expect(qs.parse('pets=["tobi"]'))
      .to.eql({ pets: '["tobi"]' });

    expect(qs.parse('operators=[">=", "<="]'))
      .to.eql({ operators: '[">=", "<="]' });

    expect(qs.parse('op[>=]=[1,2,3]'))
      .to.eql({ op: { '>=': '[1,2,3]' }});

    expect(qs.parse('op[>=]=[1,2,3]&op[=]=[[[[1]]]]'))
      .to.eql({ op: { '>=': '[1,2,3]', '=': '[[[[1]]]]' }});
  })

  it('should support empty values', function(){
    expect(qs.parse('')).to.eql({});
    expect(qs.parse(undefined)).to.eql({});
    expect(qs.parse(null)).to.eql({});
  })

  it('should transform arrays to objects', function(){
    expect(qs.parse('foo[0]=bar&foo[bad]=baz')).to.eql({ foo: { 0: "bar", bad: "baz" }});
    expect(qs.parse('foo[bad]=baz&foo[0]=bar')).to.eql({ foo: { 0: "bar", bad: "baz" }});
  })

  it('should support malformed uri chars', function(){
    expect(qs.parse('{%:%}')).to.eql({ '{%:%}': '' });
    expect(qs.parse('foo=%:%}')).to.eql({ 'foo': '%:%}' });
  })

  it('should support semi-parsed strings', function(){
    expect(qs.parse({ 'user[name]': 'tobi' }))
      .to.eql({ user: { name: 'tobi' }});

    expect(qs.parse({ 'user[name]': 'tobi', 'user[email][main]': 'tobi@lb.com' }))
      .to.eql({ user: { name: 'tobi', email: { main: 'tobi@lb.com' } }});
  })

  it('should support custom delimiters', function(){
    expect(qs.parse('foo.bar=rawr', '.'))
      .to.eql({ foo: { bar: 'rawr' } });

    expect(qs.parse('foo.bar=rawr&foo.rawr=bar', '.'))
      .to.eql({ foo: { bar: 'rawr', rawr: 'bar' }});

    expect(qs.parse('foo.bar=rawr&foo.bar=rawk', '.'))
      .to.eql({ foo: { bar: ['rawr', 'rawk'] }});
  })

  it('should support mix and match', function() {
    expect(qs.parse('foo.bar[0][]=rawr', '.'))
      .to.eql({ foo: { bar: [['rawr']] }});

    expect(qs.parse('foo.bar.fib[hello][world]=rawk', '.'))
      .to.eql({ foo: { bar: { fib: { hello: { world: 'rawk' } }}}});

    expect(qs.parse('foo[bar].rawr=fubar', '.'))
      .to.eql({ foo: { bar: { rawr: 'fubar' } }});

    expect(qs.parse('foo[bar].rawk.on=fubar', '.'))
      .to.eql({ foo: { bar: { rawk: { on: 'fubar' } }}});

    expect(qs.parse('foo[0].bar=rawr&foo[0].boo=rawk&foo[1].bar=bump', '.'))
      .to.eql({ foo: [ { bar: 'rawr', boo: 'rawk' }, { bar: 'bump' } ]});

    expect(qs.parse('foo[bar].rawk[on].boom=fubar', '.'))
      .to.eql({ foo: { bar: { rawk: { on: { boom: 'fubar' } }}}});
  })

  it('should support delimiters in keys', function() {
    expect(qs.parse('foo[rawk.on]=rawr', '.'))
      .to.eql({ foo: { 'rawk.on': 'rawr' } });

    expect(qs.parse('foo.bar[boom.shaka].lacka=bump', '.'))
      .to.eql({ foo: { bar: { 'boom.shaka': { 'lacka': 'bump' } }}});
  })

  it('should support right-hand side delimiters', function() {
    expect(qs.parse('foo.bar=boom.shaka.lacka', '.'))
      .to.eql({ foo: { bar: 'boom.shaka.lacka' }});

    expect(qs.parse('foo[boing]=shakala.kaaa', '.'))
      .to.eql({ foo: { boing: 'shakala.kaaa' }});
  })

  it('should support semi-parsed delimited strings', function(){
    expect(qs.parse({ 'user.name': 'tobi' }, '.'))
      .to.eql({ user: { name: 'tobi' }});

    expect(qs.parse({ 'user.name': 'tobi', 'user[email].main': 'tobi@lb.com' }, '.'))
      .to.eql({ user: { name: 'tobi', email: { main: 'tobi@lb.com' } }});
  })
})