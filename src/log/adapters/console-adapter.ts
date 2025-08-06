import type { LoggerAdapter } from "./base-adapter";

export class ConsoleAdapter implements LoggerAdapter {
	async write(message: string): Promise<void> {
		console.log(message);
	}

	async writeError(message: string): Promise<void> {
		console.error(message);
	}
}
