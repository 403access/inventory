// import { PrinterService } from "./src/services/PrinterService";

// const printerService = new PrinterService();
// printerService
// 	.getAvailablePrinters()
// 	.then((printers) => {
// 		console.log("Available Printers:", printers);
// 	})
// 	.catch((err) => {
// 		console.error("Error fetching printers:", err);
// 	});

import fs from "node:fs";
import path, { dirname, resolve } from "node:path";

// ```
// sudo log stream --predicate 'subsystem == "com.apple.bluetooth"' --info
// ```

// ```
// sudo log stream --predicate 'eventMessage CONTAINS "com.supvan.IPrinter-central"' --info
// ```

// ```
// system_profiler SPBluetoothDataType
// ```
// Output example:
//   Connected:
//       T0147B2503175104:
//           Address: A4:93:40:84:68:16
//           Vendor ID: 0x05AC
//           Product ID: 0x0239
//           Firmware Version: 6.4.4
//           Minor Type: Imaging Device
//           RSSI: -51
//           Services: 0x400000 < BLE >

// ```
// strings IPrinter | less > ~/Downloads/IPrinter-Strings.txt
// ```

// ```
// otool -L IPrinter > ~/Downloads/IPrinter-Imports.txt
// ```

// ```
// strings IPrinter | grep -i "write\|print\|image\|ble\|characteristic" > ~/Downloads/IPrinter-Strings-Specific.txt
// ```

// ```
// class-dump -H IPrinter -o ~/Downloads/IPrinter-Headers
// ```

import { fileURLToPath } from "node:url";
import noble from "@abandonware/noble";
import { convertImageToPrintBuffer } from "./convert-image";

noble.on("stateChange", async (state) => {
	if (state === "poweredOn") {
		console.log("🔍 Scanning...");
		await noble.startScanningAsync([], false);
	} else {
		await noble.stopScanningAsync();
	}
});

noble.on("discover", async (peripheral) => {
	if (peripheral.advertisement.localName?.includes("T0147B2503175104")) {
		console.log(
			`✅ Found SUPVAN Printer: ${peripheral.advertisement.localName} (${peripheral.address})`,
		);
		await noble.stopScanningAsync();

		await peripheral.connectAsync();
		console.log("🔗 Connected.");

		const services = await peripheral.discoverServicesAsync([]);
		for (const service of services) {
			console.log(`📡 Service UUID: ${service.uuid}`);

			const characteristics = await service.discoverCharacteristicsAsync([]);
			for (const char of characteristics) {
				console.log(
					`  └─ 📎 Characteristic UUID: ${char.uuid} | Properties: ${char.properties.join(", ")}`,
				);

				if (char.uuid.includes("0000ffe9000")) {
					const __filename = fileURLToPath(import.meta.url);
					const __dirname = dirname(__filename);

					const imagePath = path.join(
						__dirname,
						"public/labels/label_23de4e37-eb91-81a2-9e36-c72013d5995b.png",
					);
					console.log(`📸 Converting image: ${imagePath}`);
					const buffer = await convertImageToPrintBuffer(imagePath);
					await char.writeAsync(buffer, false);

					break;
				}
			}
		}

		await peripheral.disconnectAsync();
		console.log("🔌 Disconnected.");
	}
});
