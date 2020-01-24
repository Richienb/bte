"use strict"

import bluetooth from "cross-bluetooth"
import ow from "ow"
import { MergeExclusive } from "type-fest"
import EventEmitter from "events"
import pMap from "p-map"

/**
 * An elegant Bluetooth interface.
 * @param options Options.
 * @example
 * ```
 * const bte = require("bte");
 *
 * (async () => {
 * 	// Request Bluetooth device
 * 	const device = await bte({ services: ["battery_service"] });
 *
 * 	// Get battery service
 * 	const service = await device.getService("battery_service");
 *
 * 	// Get battery level characteristic
 * 	const characteristic = await service.getCharacteristic("battery_level");
 *
 * 	// Get battery level
 * 	const value = await characteristic.read();
 *
 * 	// Parse battery level
 * 	const batteryLevel = value.getUint8(0);
 * 	console.log(`The current battery level is ${batteryLevel}.`);
 * })();
 * ```
*/
async function bte(options: MergeExclusive<{
	/** The name to match. */
	name?: string
}, {
	/** The name prefix to match. */
	namePrefix?: string
}> & {
	/** The services to match. */
	services?: BluetoothServiceUUID[],

	/** Optional services. */
	optionalServices?: BluetoothServiceUUID[]
} = {}) {
	ow(options, ow.optional.object.exactShape({
		name: ow.optional.string,
		namePrefix: ow.optional.string,
		services: ow.optional.array,
		optionalServices: ow.optional.array
	}))

	if (!await bte.isReady()) throw Error("Not ready to connect to a device.")

	const { id, name, gatt } = await bluetooth.requestDevice(
		(options.name || options.namePrefix || options.services) ? {
			filters: [{ services: options.services, name: options.name, namePrefix: options.namePrefix }],
			optionalServices: options.optionalServices
		} : {
				acceptAllDevices: true,
				optionalServices: options.optionalServices
			}
	)

	const device = await gatt.connect()

	async function toDescriptor(descriptor: BluetoothRemoteGATTDescriptor) {
		return {
			uuid: descriptor.uuid,
			value: descriptor.value,
			read: () => descriptor.readValue(),
			write: () => descriptor.writeValue,
		}
	}

	async function toCharacteristic(characteristic: BluetoothRemoteGATTCharacteristic) {
		const emitter = new EventEmitter()
		characteristic.addEventListener("characteristicvaluechanged", async () => emitter.emit("changed", await characteristic.readValue()))

		return {
			uuid: characteristic.uuid,
			value: characteristic.value,
			read: () => characteristic.readValue(),
			write: () => characteristic.writeValue,
			async getDescriptor(descriptor: BluetoothDescriptorUUID) {
				return toDescriptor(await characteristic.getDescriptor(descriptor))
			},
			async getDescriptors(descriptor?: BluetoothDescriptorUUID) {
				return pMap(await characteristic.getDescriptors(descriptor), (obj) => toDescriptor(obj))
			},
			...emitter
		}
	}

	async function toService(service: BluetoothRemoteGATTService) {
		return {
			uuid: service.uuid,
			isPrimary: service.uuid,
			async getCharacteristic(characteristic: BluetoothServiceUUID) {
				return toCharacteristic(await service.getCharacteristic(characteristic))
			},
			async getCharacteristics(characteristic?: BluetoothServiceUUID) {
				return pMap(await service.getCharacteristics(characteristic), (obj) => toCharacteristic(obj))
			},
		}
	}

	return {
		id,
		name,
		async getService(service: BluetoothServiceUUID) {
			return toService(await device.getPrimaryService(service))
		},
		async getServices(service?: BluetoothServiceUUID) {
			return pMap(await device.getPrimaryServices(service), (obj) => toService(obj))
		}
	}
}

namespace bte {
	export async function isReady() {
		return await bluetooth.getAvailability()
	}
}

export = bte
