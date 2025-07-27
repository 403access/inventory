import { db, notionDatabaseTableName } from "../database/setup";
import type { SetupConfig } from "../server/setup";

export type NotionDatabase = {
	id: string;
	title: string;
	url: string;
	created_time: string;
	last_edited_time: string | null;
};

export function convertDatabaseRowToNotionDatabase(row: any): NotionDatabase {
	return {
		id: row.id,
		title: row.title,
		url: row.url,
		created_time: row.created_time,
		last_edited_time: row.last_edited_time,
	};
}

export class NotionDatabaseRepository {
	constructor(private setup: SetupConfig) {}

	public insertDatabase(database: NotionDatabase): void {
		console.log("Inserting database:", database);

		const sql = `
				INSERT INTO ${notionDatabaseTableName} (id, title, url, created_time, last_edited_time)
				VALUES (?, ?, ?, ?, ?)
			`;
		db.query(sql).run(
			database.id,
			database.title,
			database.url,
			database.created_time,
			database.last_edited_time,
		);
	}

	public updateDatabase(database: NotionDatabase): void {
		console.log("Updating database:", database);
		const sql = `
			UPDATE ${notionDatabaseTableName}
			SET title = ?, url = ?, last_edited_time = ?
			WHERE id = ?
		`;
		db.query(sql).run(
			database.title,
			database.url,
			database.last_edited_time,
			database.id,
		);
	}

	public getDatabase(): NotionDatabase | null {
		const query = db.query(
			`SELECT * FROM ${notionDatabaseTableName} WHERE id = $id`,
		);
		const queryResult = query.all({ $id: this.setup.NOTION_DATABASE_ID });
		if (queryResult.length > 1) {
			throw new Error("Multiple databases found with the same ID");
		}

		if (queryResult.length === 0) {
			return null;
		}

		const row = queryResult[0] as any;
		return convertDatabaseRowToNotionDatabase(row);
	}

	public getAllDatabases(): NotionDatabase[] {
		const query = db.query(`SELECT * FROM ${notionDatabaseTableName}`);
		const queryResult = query.all();
		return queryResult.map((row: any) =>
			convertDatabaseRowToNotionDatabase(row),
		);
	}
}
