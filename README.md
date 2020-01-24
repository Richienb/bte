# Bte [![Travis CI Build Status](https://img.shields.io/travis/com/Richienb/bte/master.svg?style=for-the-badge)](https://travis-ci.com/Richienb/bte)

An elegant Bluetooth interface.

[![NPM Badge](https://nodei.co/npm/bte.png)](https://npmjs.com/package/bte)

## Install

```sh
npm install bte
```

## Usage

```js
const bte = require("bte");

(async () => {
	// Request Bluetooth device
	const device = await bte({ services: ["battery_service"] });

	// Get battery service
	const service = await device.getService("battery_service");

	// Get battery level characteristic
	const characteristic = await service.getCharacteristic("battery_level");

	// Get battery level
	const value = await characteristic.read();

	// Parse battery level
	const batteryLevel = value.getUint8(0);
	console.log(`The current battery level is ${batteryLevel}.`);
})();
```

## API

### bte(options?)

#### options

Type: `object`

##### name or namePrefix

Type: `string`

The name or name prefix to match.

##### services

Type: `array`

The services to match.

##### optionalServices

Type: `array`

Optional services.

### bte.isReady()
