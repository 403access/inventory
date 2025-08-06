#!/usr/bin/env bun

/**
 * Logging System Demo
 *
 * This script demonstrates the file-based logging capabilities
 * of the inventory uploader application.
 */

import { initializeLogger, log, logJSON } from "./src/log/app-logger";
import { createFolders } from "./src/utils/folders";

async function demonstrateLogging() {
	console.log("🔧 Setting up logging demonstration...\n");

	// Create folders (including logs directory)
	const folders = await createFolders();

	// Initialize the file logger
	const logFilePath = `${folders.LOGS_DIR}/demo.log`;
	const logger = initializeLogger(logFilePath);

	console.log(`📝 Logging to: ${logFilePath}\n`);

	// Targets example
	logger.log("Only visible in the log file, not console");
	log("Same as logger.log, but using the helper function");
	console.log("Only visible in the console, not log file");

	// Demonstrate different types of logging
	await log("Demo started - testing file-based logging system");
	await log("Simple log message with data:", "example value", 42);

	// Log JSON data
	const sampleData = {
		timestamp: new Date().toISOString(),
		user: { id: 123, name: "Test User" },
		action: "demonstration",
		metadata: {
			version: "1.0.0",
			environment: "development",
		},
	};

	await logJSON("Sample JSON data logged", sampleData);

	// Log an array
	const items = ["item1", "item2", "item3"];
	await log("Processing items:", JSON.stringify(items));

	// Simulate some application activity
	await log("Simulating application startup sequence");
	await log("Database connection established");
	await log("Routes configured");
	await log("Server ready to accept connections");

	await log("Demo completed successfully");

	console.log("✅ Logging demonstration completed!");
	console.log(`📖 Check the log file at: ${logFilePath}`);
	console.log("\nTo view the logs:");
	console.log(`   cat ${logFilePath}`);
	console.log(`   tail -f ${logFilePath}  # Follow logs in real-time`);
}

// Run the demonstration
demonstrateLogging().catch(console.error);
