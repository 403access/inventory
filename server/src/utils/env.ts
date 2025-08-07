import * as fs from "node:fs/promises";

export const getEnv = async () => {
	const ENV_FILE = "./local.env";
	const envText = await fs.readFile(ENV_FILE, "utf8").catch(() => null);

	if (!envText) {
		console.error("❌ Missing local.env file.");
		process.exit(1);
	}

	const env = Object.fromEntries(
		envText
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith("#"))
			.map((line) => line.split("=").map((v) => v.trim())),
	);
	return env;
};

export const validateEnv = <T extends readonly string[]>(
	env: Record<string, string>,
	keys: T,
): Record<T[number], string> => {
	for (const key of keys) {
		if (!env[key]) {
			console.error(`❌ Missing ${key} in local.env.`);
			process.exit(1);
		}
	}

	// Create a type-safe object with only the validated keys
	const validatedEnv = {} as Record<T[number], string>;
	for (const key of keys) {
		validatedEnv[key as T[number]] = env[key];
	}

	return validatedEnv;
};
