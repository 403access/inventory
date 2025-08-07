#!/usr/bin/env bun

/**
 * Log Viewer Utility
 *
 * This script provides various ways to view log files with newest entries first
 */

import { watch } from "node:fs";
import * as fs from "node:fs/promises";
import { createFolders } from "../../utils/folders";

interface LogViewerOptions {
	lines?: number;
	follow?: boolean;
	filter?: string;
}

async function viewLogs(logFile: string, options: LogViewerOptions = {}) {
	const { lines = 20, follow = false, filter } = options;

	try {
		// Read the entire log file
		const content = await fs.readFile(logFile, "utf-8");

		// Split into lines and reverse to show newest first
		let logLines = content.trim().split("\n").reverse();

		// Apply filter if provided
		if (filter) {
			logLines = logLines.filter((line) =>
				line.toLowerCase().includes(filter.toLowerCase()),
			);
		}

		// Limit the number of lines
		if (lines > 0) {
			logLines = logLines.slice(0, lines);
		}

		// Display the logs
		console.log(
			`\n📋 Showing ${logLines.length} most recent log entries from: ${logFile}`,
		);
		console.log("=".repeat(80));

		logLines.forEach((line) => {
			if (line.trim()) {
				console.log(line);
			}
		});

		console.log("=".repeat(80));

		if (follow) {
			console.log("\n👀 Following log file... (Press Ctrl+C to stop)");
			console.log("New entries will appear below:\n");

			let lastSize = 0;
			try {
				const initialStats = await fs.stat(logFile);
				lastSize = initialStats.size;
			} catch (error) {
				console.error("Error getting initial file size:", error);
			}

			// Watch for file changes
			const watcher = watch(logFile, async (eventType) => {
				if (eventType === "change") {
					try {
						const stats = await fs.stat(logFile);
						if (stats.size > lastSize) {
							// Read only the new content
							const stream = await fs.open(logFile, "r");
							const buffer = Buffer.alloc(stats.size - lastSize);
							await stream.read(buffer, 0, buffer.length, lastSize);
							await stream.close();

							const newContent = buffer.toString("utf-8");
							const newLines = newContent
								.split("\n")
								.filter((line) => line.trim());

							newLines.forEach((line) => {
								if (filter) {
									if (line.toLowerCase().includes(filter.toLowerCase())) {
										console.log(line);
									}
								} else {
									console.log(line);
								}
							});

							lastSize = stats.size;
						}
					} catch (error) {
						console.error("Error reading file changes:", error);
					}
				}
			});

			// Handle graceful shutdown
			process.on("SIGINT", () => {
				console.log("\n👋 Stopping log following...");
				watcher.close();
				process.exit(0);
			});

			// Keep the process alive
			return new Promise(() => {});
		}
	} catch (error) {
		console.error(`❌ Error reading log file: ${error}`);
	}
}

async function main() {
	const folders = await createFolders();
	const serverLogPath = `${folders.LOGS_DIR}/server.log`;
	const demoLogPath = `${folders.LOGS_DIR}/demo.log`;

	const args = process.argv.slice(2);
	const command = args[0] || "server";

	switch (command) {
		case "server":
			await viewLogs(serverLogPath, { lines: 20 });
			break;

		case "demo":
			await viewLogs(demoLogPath, { lines: 20 });
			break;

		case "all":
			console.log("\n🔍 SERVER LOGS:");
			await viewLogs(serverLogPath, { lines: 10 });
			console.log("\n🔍 DEMO LOGS:");
			await viewLogs(demoLogPath, { lines: 10 });
			break;

		case "search": {
			const searchTerm = args[1];
			if (!searchTerm) {
				console.log(
					'❌ Please provide a search term: bun run view-logs.ts search "error"',
				);
				process.exit(1);
			}
			console.log(`🔎 Searching for: "${searchTerm}"`);
			await viewLogs(serverLogPath, { lines: 50, filter: searchTerm });
			break;
		}

		case "follow":
			console.log("📡 Following server logs in real-time...");
			await viewLogs(serverLogPath, { lines: 10, follow: true });
			break;

		case "follow-search": {
			const searchTerm = args[1];
			if (!searchTerm) {
				console.log(
					'❌ Please provide a search term: bun run view-logs.ts follow-search "error"',
				);
				process.exit(1);
			}
			console.log(`📡 Following logs and filtering for: "${searchTerm}"`);
			await viewLogs(serverLogPath, {
				lines: 5,
				follow: true,
				filter: searchTerm,
			});
			break;
		}

		default:
			console.log(`
📖 Log Viewer Usage:

  bun run view-logs.ts [command] [args]

Commands:
  server           Show recent server logs (default)
  demo             Show recent demo logs  
  all              Show both server and demo logs
  search <term>    Search logs for a term
  follow           Follow server logs in real-time
  follow-search <term>  Follow logs and filter for a term
  
Examples:
  bun run view-logs.ts
  bun run view-logs.ts server
  bun run view-logs.ts search "error"
  bun run view-logs.ts search "notion"
  bun run view-logs.ts follow
  bun run view-logs.ts follow-search "database"
  
Note: Use Ctrl+C to stop following logs
            `);
	}
}

main().catch(console.error);
