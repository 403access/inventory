export interface LoggerAdapter {
	write(message: string): Promise<void>;
	writeError(message: string): Promise<void>;
}

export type LoggerType = "console" | "file" | "memory";
