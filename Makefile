VERSION := $(shell grep -m1 '"version"' src/manifest.json | sed 's/[^0-9.]//g')

dev:
	(cd src && zip -r "../dist/FFTY-$(VERSION)-dev.zip" . -x "**/.DS_Store")

release:
	(cd src && zip -r "../dist/FFTY-$(VERSION).zip" . -x "**/.DS_Store" -x "test/*")
