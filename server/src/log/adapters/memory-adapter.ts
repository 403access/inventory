import type { LoggerAdapter } from "./base-adapter";

export class MemoryAdapter implements LoggerAdapter {
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
