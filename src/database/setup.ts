import Database from "bun:sqlite";
import { log } from "../log/app-logger";

// Initialize the SQLite database file (creates if it doesn't exist)
export const db = new Database("inventory.db");

export const notionDatabaseTableName = "NOTION_DATABASES";
export const notionPagesTableName = "NOTION_PAGES";
export const notionFilesTableName = "NOTION_FILES";

export const setupDatabase = () => {
	const createNotionDatabaseQueryResult = db.exec(`
            CREATE TABLE IF NOT EXISTS ${notionDatabaseTableName} (
                id TEXT PRIMARY KEY,
                title TEXT,
                url TEXT,
                created_time TEXT,
                last_edited_time TEXT NULL
            );
        `);

	log(
		"Notion databases table created:",
		createNotionDatabaseQueryResult.changes,
	);

	const createNotionPagesQueryResult = db.exec(`
            CREATE TABLE IF NOT EXISTS ${notionPagesTableName} (
                id TEXT PRIMARY KEY,
                database_id TEXT,
                title TEXT,
                quantity INTEGER,
                link TEXT,
                image_url TEXT,
                created_time TEXT,
                last_edited_time TEXT NULL,

                FOREIGN KEY (database_id) REFERENCES ${notionDatabaseTableName}(id) ON DELETE CASCADE
            );
        `);

	log("Notion entries table created:", createNotionPagesQueryResult);

	const createNotionFilesQueryResult = db.exec(`
            CREATE TABLE IF NOT EXISTS ${notionFilesTableName} (
                id TEXT PRIMARY KEY,
                database_id TEXT,
                page_id TEXT,
                file_url TEXT,
                created_time TEXT,
                last_edited_time TEXT NULL,

                FOREIGN KEY (page_id) REFERENCES ${notionPagesTableName}(id) ON DELETE CASCADE,
                FOREIGN KEY (database_id) REFERENCES ${notionDatabaseTableName}(id) ON DELETE CASCADE
            );
    `);

	log("Notion files table created:", createNotionFilesQueryResult);
};
