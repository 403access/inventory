import * as fs from "node:fs/promises";

interface LoggerAdapter {
	write(message: string): Promise<void>;
	writeError(message: string): Promise<void>;
}

class ConsoleAdapter implements LoggerAdapter {
	async write(message: string): Promise<void> {
		console.log(message);
	}

	async writeError(message: string): Promise<void> {
		console.error(message);
	}
}

class FileAdapter implements LoggerAdapter {
	constructor(private filePath: string) {}

	async write(message: string): Promise<void> {
		await fs.appendFile(this.filePath, message + "\n");
	}

	async writeError(message: string): Promise<void> {
		await fs.appendFile(this.filePath, message + "\n");
	}
}

class MemoryAdapter implements LoggerAdapter {
	private logEntries: string[] = [];

	async write(message: string): Promise<void> {
		this.logEntries.push(message);
	}

	async writeError(message: string): Promise<void> {
		this.logEntries.push(message);
	}

	getLogEntries(): string[] {
		return [...this.logEntries];
	}

	clearLogEntries(): void {
		this.logEntries = [];
	}
}

export type LoggerType = "console" | "file" | "memory";

export class Logger {
	private adapter: LoggerAdapter;
	private loggerType: LoggerType;

	// Constructor overloads for type safety
	constructor(type: "console");
	constructor(type: "memory");
	constructor(type: "file", filePath: string);
	constructor(type?: "console");
	constructor(type: LoggerType = "console", filePath?: string) {
		this.loggerType = type;

		switch (type) {
			case "console":
				if (filePath) {
					throw new Error("filePath should not be provided for console logger");
				}
				this.adapter = new ConsoleAdapter();
				break;
			case "file":
				if (!filePath) {
					throw new Error("filePath is required for file logger");
				}
				this.adapter = new FileAdapter(filePath);
				break;
			case "memory":
				if (filePath) {
					throw new Error("filePath should not be provided for memory logger");
				}
				this.adapter = new MemoryAdapter();
				break;
		}
	}

	private getTimestamp(): string {
		return new Date().toISOString();
	}

	private getPrefix(): string {
		return `[${this.getTimestamp()}]`;
	}

	public async log(message: string, ...args: unknown[]): Promise<void> {
		const formattedMessage =
			args.length > 0
				? `${this.getPrefix()} ${message} ${args.map((arg) => String(arg)).join(" ")}`
				: `${this.getPrefix()} ${message}`;
		await this.adapter.write(formattedMessage);
	}

	public async logJSON(message: string, data: unknown): Promise<void> {
		const formattedMessage = `${this.getPrefix()} ${message}\n${JSON.stringify(data, null, 2)}`;
		await this.adapter.write(formattedMessage);
	}

	public async writeJSONToFile(filePath: string, data: unknown): Promise<void> {
		try {
			await fs.writeFile(filePath, JSON.stringify(data, null, 2));
			await this.log(`JSON written to ${filePath}`);
		} catch (error) {
			await this.adapter.writeError(
				`${this.getPrefix()} Failed to write JSON to ${filePath}: ${error}`,
			);
		}
	}

	public async logAndWriteJSON(
		message: string,
		data: unknown,
		filePath?: string,
	): Promise<void> {
		// Log to configured destination
		await this.logJSON(message, data);

		// Optionally write to file
		if (filePath) {
			await this.writeJSONToFile(filePath, data);
		}
	}

	// Memory logger specific methods
	public getLogEntries(): string[] {
		if (this.loggerType !== "memory") {
			throw new Error("getLogEntries() is only available for memory logger");
		}
		return (this.adapter as MemoryAdapter).getLogEntries();
	}

	public clearLogEntries(): void {
		if (this.loggerType !== "memory") {
			throw new Error("clearLogEntries() is only available for memory logger");
		}
		(this.adapter as MemoryAdapter).clearLogEntries();
	}
}

// Export default instances for convenience
export const consoleLogger = new Logger("console");
export const memoryLogger = new Logger("memory");
export const createFileLogger = (path: string) => new Logger("file", path);
