#!/usr/bin/env bun
/**
 * Update HOST in .env to the current LAN IPv4 on macOS and start the app.
 * Run: bun run scripts/updateHostEnvValue.ts [path-to-env]
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import os, { EOL } from "node:os";
import path from "node:path";

const ENV_PATH = process.argv[2] ?? "local.env";

function getIpViaMacRoute(): string | null {
	try {
		const iface = execSync(
			"route get default 2>/dev/null | awk '/interface:/{print $2}'",
			{
				encoding: "utf8",
			},
		).trim();
		if (!iface) return null;
		const ip = execSync(`ipconfig getifaddr ${iface} 2>/dev/null`, {
			encoding: "utf8",
		}).trim();
		return ip || null;
	} catch {
		return null;
	}
}

function getFirstLanIPv4(): string | null {
	// generic fallback (works on macOS too)
	const nets = os.networkInterfaces();
	for (const name of Object.keys(nets)) {
		for (const ni of nets[name] || []) {
			if (!ni) continue;
			if (ni.family === "IPv4" && !ni.internal) {
				// heuristically skip Docker/VMs
				const lower = name.toLowerCase();
				if (/(utun|llw|awdl|bridge|docker|vmnet|vbox|lo)/.test(lower)) continue;
				return ni.address;
			}
		}
	}
	// if nothing after filtering, return the first non-internal IPv4 anyway
	for (const name of Object.keys(nets)) {
		for (const ni of nets[name] || []) {
			if (ni && ni.family === "IPv4" && !ni.internal) return ni.address;
		}
	}
	return null;
}

function resolveHost(): string {
	return getIpViaMacRoute() ?? getFirstLanIPv4() ?? "127.0.0.1";
}

function upsertEnvKey(contents: string, key: string, value: string): string {
	const lines = contents.split(/\r?\n/);
	let found = false;
	const out = lines.map((line) => {
		if (line.startsWith(`${key}=`)) {
			found = true;
			return `${key}=${value}`;
		}
		return line;
	});
	if (!found) out.push(`${key}=${value}`);
	return out.join(EOL);
}

function ensurePortDefault(contents: string, portDefault = "3000"): string {
	// Only if there's an explicit empty PORT=
	return contents.replace(/^PORT=$/m, `PORT=${portDefault}`);
}

function readEnvFile(p: string): string {
	if (!existsSync(p)) {
		// create minimal file if missing
		writeFileSync(p, "", "utf8");
	}
	return readFileSync(p, "utf8");
}

function writeEnvFile(p: string, contents: string) {
	writeFileSync(p, contents, "utf8");
}

async function main() {
	const envPathAbs = path.resolve(process.cwd(), ENV_PATH);
	console.log(`Using environment file: ${envPathAbs}`);

	let env = readEnvFile(envPathAbs);

	const ip = resolveHost();
	env = upsertEnvKey(env, "HOST", ip);
	env = ensurePortDefault(env);

	writeEnvFile(envPathAbs, env);
	console.log(`✅ HOST set to ${ip} in ${ENV_PATH}`);

	// Export to current process so child process inherits immediately
	process.env.HOST = ip;
	if (!process.env.PORT) {
		// parse from file if we just set one
		const m = env.match(/^PORT=(.+)$/m);
		if (m) process.env.PORT = m[1];
	}
}

main().catch((err) => {
	console.error("❌ Error:", err);
	process.exit(1);
});
