"use strict"

///<reference types="web-bluetooth"/>

import bluetooth from "cross-bluetooth"
import ow from "ow"
import { MergeExclusive } from "type-fest"
import EventEmitter from "events"
import pMap from "p-map"

class Descriptor {
	public readonly uuid: string
	public readonly value: DataView
	constructor(private readonly _descriptor: BluetoothRemoteGATTDescriptor) {
		this.uuid = _descriptor.uuid
		this.value = _descriptor.value
	}

	public async read(): Promise<DataView> {
		return await this._descriptor.readValue()
	}

	public async write(value: BufferSource): Promise<void> {
		return await this._descriptor.writeValue(value)
	}
}

class Characteristic extends EventEmitter {
	public readonly uuid: string
	public readonly properties: BluetoothCharacteristicProperties
	public readonly value: DataView
	constructor(private readonly _characteristic: BluetoothRemoteGATTCharacteristic) {
		super()
		_characteristic.addEventListener("characteristicvaluechanged", async () => this.emit("valuechanged", await _characteristic.readValue()))
		this.uuid = _characteristic.uuid
		this.properties = _characteristic.properties
		this.value = _characteristic.value
	}

	public async read(): Promise<void> {
		await this._characteristic.readValue()
	}

	public async write(value: BufferSource): Promise<void> {
		await this._characteristic.writeValue(value)
	}

	public async descriptors() {
		return pMap(await this._characteristic.getDescriptors(), v => new Descriptor(v))
	}
}

class Service extends EventEmitter {
	public readonly uuid: string
	public readonly isPrimary: boolean
	public readonly characteristics: Characteristic[]

	constructor(service: BluetoothRemoteGATTService, characteristics: BluetoothRemoteGATTCharacteristic[]) {
		super()
		service.addEventListener("serviceadded", (data) => super.emit("added", data))
		service.addEventListener("servicechanged", (data) => super.emit("changed", data))
		service.addEventListener("serviceremoved", (data) => super.emit("removed", data))
		this.uuid = service.uuid
		this.isPrimary = service.isPrimary
		this.characteristics = characteristics.map(v => new Characteristic(v))
	}
}

export async function request(options: MergeExclusive<{
	name?: string
}, {
	namePrefix?: string
}> & {
	services?: BluetoothServiceUUID[],
	optionalServices?: BluetoothServiceUUID[]
} = {}) {
	ow(options, ow.optional.object.exactShape({
		name: ow.optional.string,
		namePrefix: ow.optional.string,
		services: ow.optional.array,
		optionalServices: ow.optional.array
	}))

	if (!await isReady()) throw Error("Not ready to connect to a device.")

	const { id, name, gatt } = await bluetooth.requestDevice(
		(options.name || options.namePrefix || options.services) ? {
			filters: [{ services: options.services, name: options.name, namePrefix: options.namePrefix }],
			optionalServices: options.optionalServices
		} : {
				acceptAllDevices: true,
				optionalServices: options.optionalServices
			}
	)

	const services = await pMap(await gatt.getPrimaryServices(), async service => new Service(service, await service.getCharacteristics()))

	return {
		id,
		name,
		gatt: await gatt.connect(),
		services,
		primaryService: services.filter(({ isPrimary }) => isPrimary)[0],
		disconnect: gatt.disconnect,
	}
}

export async function isReady() {
	return await bluetooth.getAvailability()
}
