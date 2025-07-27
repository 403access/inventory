import { db, notionFilesTableName } from "../database/setup";

export type NotionFile = {
	id: string;
	database_id: string;
	page_id: string;
	file_url: string;
	created_time: string;
	last_edited_time: string | null;
};

export function convertDatabaseRowToNotionFile(row: any): NotionFile {
	return {
		id: row.id,
		database_id: row.database_id,
		page_id: row.page_id,
		file_url: row.file_url,
		created_time: row.created_time,
		last_edited_time: row.last_edited_time,
	};
}

export class NotionFilesRepository {
	public insertFile(file: NotionFile): void {
		console.log("Inserting file:", file);

		const sql = `
            INSERT INTO ${notionFilesTableName} (id, page_id, file_url)
            VALUES (?, ?, ?)
        `;
		db.query(sql).run(file.id, file.page_id, file.file_url);
	}

	public insertFiles(files: NotionFile[]): void {
		console.log("Inserting files:", files);
		const sql = `
			INSERT INTO ${notionFilesTableName} (id, database_id, page_id, file_url, created_time, last_edited_time)
			VALUES (?, ?, ?, ?, ?, ?)
		`;

		files.forEach((file) => {
			db.query(sql).run(
				file.id,
				file.database_id,
				file.page_id,
				file.file_url,
				file.created_time,
				file.last_edited_time,
			);
		});
	}

	public getFileById(id: string): NotionFile | null {
		const query = db.query(
			`SELECT * FROM ${notionFilesTableName} WHERE id = $id`,
		);
		const queryResult = query.get({ $id: id });
		return queryResult ? convertDatabaseRowToNotionFile(queryResult) : null;
	}

	public getFilesByDatabaseId(databaseId: string): NotionFile[] {
		const query = db.query(
			`SELECT * FROM ${notionFilesTableName} WHERE database_id = $databaseId`,
		);
		const queryResult = query.all({ $databaseId: databaseId });

		return queryResult.map(convertDatabaseRowToNotionFile);
	}

	public getMostRecentFileByDatabaseId(databaseId: string): NotionFile | null {
		const query = db.query(
			`SELECT * FROM ${notionFilesTableName} WHERE database_id = $databaseId
			ORDER BY created_time DESC LIMIT 1`,
		);
		const queryResult = query.get({ $databaseId: databaseId });

		return queryResult ? convertDatabaseRowToNotionFile(queryResult) : null;
	}

	public getFilesByPageId(pageId: string): NotionFile[] {
		const query = db.query(
			`SELECT * FROM ${notionFilesTableName} WHERE page_id = $pageId`,
		);
		const queryResult = query.all({ $pageId: pageId });

		return queryResult.map(convertDatabaseRowToNotionFile);
	}

	public getFiles(): NotionFile[] {
		const query = db.query(`SELECT * FROM ${notionFilesTableName}`);
		const queryResult = query.all();

		return queryResult.map(convertDatabaseRowToNotionFile);
	}
}
