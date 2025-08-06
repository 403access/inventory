#!/usr/bin/env bun

/**
 * Quick Log Viewer
 *
 * Simple command to quickly view recent logs
 */

import { createFolders } from "../../utils/folders";
import { getRecentLogs } from "../app-logger";

async function main() {
	const folders = await createFolders();
	const serverLogPath = `${folders.LOGS_DIR}/server.log`;

	console.log("🔍 Recent Server Logs (newest first):");
	console.log("=".repeat(60));

	const recentLogs = await getRecentLogs(serverLogPath, 15);

	if (recentLogs.length === 0) {
		console.log("No logs found.");
	} else {
		recentLogs.forEach((log) => console.log(log));
	}

	console.log("=".repeat(60));
	console.log(`📁 Full log file: ${serverLogPath}`);
	console.log("💡 For more options: bun run view-logs.ts");
}

main().catch(console.error);
