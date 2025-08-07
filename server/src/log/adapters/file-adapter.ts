import * as fs from "node:fs/promises";
import type { LoggerAdapter } from "./base-adapter";

export class FileAdapter implements LoggerAdapter {
	constructor(private filePath: string) {}

	async write(message: string): Promise<void> {
		await fs.appendFile(this.filePath, `${message}\n`);
	}

	async writeError(message: string): Promise<void> {
		await fs.appendFile(this.filePath, `${message}\n`);
	}
}
