PORT ?= 9876

.PHONY: all
all: debug

.PHONY: audit
audit:
	npm audit --audit-level=high

.PHONY: install
install:
	npm install --unsafe-perm

.PHONY: build
build: install
	npm run webpack-production

.PHONY: debug
debug: install watch

.PHONY: watch
watch:
	PORT=$(PORT) npm run webpack-server

.PHONY: clean
clean:
	rm -rf node_modules dist
