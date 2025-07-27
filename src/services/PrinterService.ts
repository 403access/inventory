import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export class PrinterService {
	private preferredPrinterModel = "SUPVAN T50M Pro";

	public async getAvailablePrinters(): Promise<string[]> {
		try {
			const { stdout } = await execAsync("lpstat -p");
			const printers = stdout
				.split("\n")
				.filter((line) => line.startsWith("printer "))
				.map((line) => line.split(" ")[1]);
			return printers;
		} catch (err) {
			console.error("❌ Fehler beim Abrufen der Drucker:", err);
			return [];
		}
	}

	public async findPreferredPrinter(): Promise<string | null> {
		const printers = await this.getAvailablePrinters();
		for (const printer of printers) {
			if (
				printer.toLowerCase().includes("supvan") ||
				printer.includes("T50M")
			) {
				return printer;
			}
		}
		return null;
	}

	public async printLabel(filePath: string): Promise<void> {
		const printer = await this.findPreferredPrinter();
		if (!printer) {
			throw new Error("❌ SUPVAN T50M Pro Drucker nicht gefunden.");
		}

		const absolutePath = path.resolve(filePath);
		const command = `lp -d "${printer}" "${absolutePath}"`;

		try {
			const { stdout } = await execAsync(command);
			console.log("🖨️ Druckauftrag erfolgreich:", stdout);
		} catch (err) {
			console.error("❌ Druck fehlgeschlagen:", err);
			throw err;
		}
	}
}
