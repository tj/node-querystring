SRC = lib/querystring.js

all: querystring.js querystring.min.js

test:
	@./node_modules/.bin/mocha

querystring.js: $(SRC)
	cat $^ > $@

querystring.min.js: querystring.js
	uglifyjs --no-mangle $< > $@

.PHONY: test
