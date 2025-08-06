import { consoleLogger, createFileLogger, type Logger } from "./logger";

/**
 * Global application logger instance
 */
let appLogger: Logger = consoleLogger;

/**
 * Initialize the application logger with file logging
 * @param logFilePath Path to the log file
 */
export const initializeLogger = async (
	logFilePath: string,
): Promise<Logger> => {
	appLogger = createFileLogger(logFilePath);

	await log("");
	await log("");
	await log("");
	await log("");
	await log("");
	await log(
		"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
	);
	await log("");
	await log("\t\t\tNEW LOGGING SESSION STARTED");
	await log("");
	await log("");
	await log(
		"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
	);

	return appLogger;
};

/**
 * Get the current application logger instance
 */
export const getLogger = (): Logger => {
	return appLogger;
};

/**
 * Set a custom logger instance
 */
export const setLogger = (logger: Logger): void => {
	appLogger = logger;
};

/**
 * Helper function to log messages using the current app logger
 * This can be used as a drop-in replacement for console.log
 */
export const log = async (
	message: string,
	...args: unknown[]
): Promise<void> => {
	await appLogger.log(message, ...args);
};

/**
 * Helper function to log JSON data using the current app logger
 */
export const logJSON = async (
	message: string,
	data: unknown,
): Promise<void> => {
	await appLogger.logJSON(message, data);
};
