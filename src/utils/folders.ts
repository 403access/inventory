import * as fs from "node:fs/promises";

/**
 * InvertFolderSpec takes a folder specification object and inverts it.
 * It converts keys that are strings into values, and keeps nested objects intact.
 * This is useful for creating a mapping of folder names to their paths.
 *
 * Example input:
 * ```typescript
 * {
 *  public: {
 *   images: "IMAGE_DIR",
 *   labels: "LABEL_DIR",
 *   csv: "CSV_DIR",
 *  }
 * }
 * ```
 *
 * Example output:
 * ```typescript
 * {
 * public: {
 *   IMAGE_DIR: string,
 *   LABEL_DIR: string,
 *   CSV_DIR: string,
 *  }
 * }
 * ```
 */

/**
 * Helper type utilities for folder specification transformation
 */

// Check if a type is a string literal
type IsStringLiteral<T> = T extends string ? true : false;

// Transform a key: use the string value as key, otherwise keep original key
// Added constraint to ensure the result is always a valid key type
type TransformKey<
	OriginalKey extends string | number | symbol,
	Value,
> = IsStringLiteral<Value> extends true
	? Value extends string | number | symbol
		? Value
		: OriginalKey
	: OriginalKey;

// Transform a value: strings become paths, objects get recursively transformed
type TransformValue<T> = IsStringLiteral<T> extends true
	? string
	: InvertFolderSpec<T>;

// Main transformation: invert folder spec structure
type InvertFolderSpec<T> = {
	[K in keyof T as TransformKey<K, T[K]>]: TransformValue<T[K]>;
};

/**
 * Folder specification and creation functions
 */

// Type constraint for folder specifications - using interface for proper recursion
interface FolderSpecification {
	[key: string]: string | FolderSpecification;
}

async function createFoldersRecursive<T extends FolderSpecification>(
	spec: T,
	parentPath = ".",
): Promise<InvertFolderSpec<T>> {
	const entries = await Promise.all(
		Object.entries(spec).map(async ([key, value]) => {
			const currentPath = `${parentPath}/${key}`;

			const fileOrFolderExists = await fs.exists(currentPath);
			if (fileOrFolderExists) {
				console.log(`✅ Folder already exists: ${currentPath}`);
			} else {
				await fs.mkdir(currentPath, { recursive: true });
				console.log(`✅ Created folder: ${currentPath}`);
			}

			if (typeof value === "string") {
				// String value becomes the key, path becomes the value
				return [value, currentPath] as const;
			} else if (typeof value === "object" && value !== null) {
				// Nested object: recurse and keep original key
				const subTree = await createFoldersRecursive(value, currentPath);
				return [key, subTree] as const;
			} else {
				throw new Error(`Invalid folder specification value: ${value}`);
			}
		}),
	);

	return Object.fromEntries(entries) as InvertFolderSpec<T>;
}

/**
 * Folder specification configuration
 */
export const folderSpec = {
	public: {
		images: "IMAGE_DIR",
		labels: "LABEL_DIR",
		csv: "CSV_DIR",
	},
} as const;

/**
 * Main export: creates folders and returns inverted structure
 */
export const createFolders = async () => {
	return await createFoldersRecursive(folderSpec);
};

// Export types for external use
export type FolderResult = Awaited<ReturnType<typeof createFolders>>;
