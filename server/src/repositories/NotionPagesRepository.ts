import { db, notionPagesTableName } from "../database/setup";
import { log } from "../log/app-logger";

export type NotionPage = {
	id: string;
	database_id: string;
	title: string;
	quantity: number;
	link: string;
	image_url: string;
	created_time: string;
	last_edited_time: string | null;
};

export function convertDatabaseRowToNotionPage(row: any): NotionPage {
	return {
		id: row.id,
		database_id: row.database_id,
		title: row.title,
		quantity: row.quantity,
		link: row.link,
		image_url: row.image_url,
		created_time: row.created_time,
		last_edited_time: row.last_edited_time,
	};
}

export class NotionPagesRepository {
	public insertPage(page: NotionPage): void {
		log("Inserting page:", page);

		const sql = `
			INSERT INTO ${notionPagesTableName} (id, database_id, title, quantity, link, image_url, created_time, last_edited_time)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`;
		db.query(sql).run(
			page.id,
			page.database_id,
			page.title,
			page.quantity,
			page.link,
			page.image_url,
			page.created_time,
			page.last_edited_time,
		);
	}

	public getAllPages(): NotionPage[] {
		const query = db.query(`SELECT * FROM ${notionPagesTableName}`);
		const queryResult = query.all();

		return queryResult.map(convertDatabaseRowToNotionPage);
	}

	public getPagesByDatabaseId(databaseId: string): NotionPage[] {
		const query = db.query(
			`SELECT * FROM ${notionPagesTableName} WHERE database_id = $databaseId`,
		);
		const queryResult = query.all({ $databaseId: databaseId });

		return queryResult.map(convertDatabaseRowToNotionPage);
	}

	public getPagesByDatabaseIdSince(
		databaseId: string,
		last_edited_time: string,
	): NotionPage[] {
		const query = db.query(
			`SELECT * FROM ${notionPagesTableName}
			WHERE database_id = $databaseId AND last_edited_time > $last_edited_time`,
		);
		const queryResult = query.all({
			$databaseId: databaseId,
			$last_edited_time: last_edited_time,
		});

		return queryResult.map(convertDatabaseRowToNotionPage);
	}

	public getPageById(id: string): NotionPage | null {
		const query = db.query(
			`SELECT * FROM ${notionPagesTableName} WHERE id = $id`,
		);
		const queryResult = query.all({ $id: id });

		if (queryResult.length > 1) {
			throw new Error("Multiple pages found with the same ID");
		}

		if (!queryResult) {
			return null;
		}

		const row = queryResult[0] as any;
		return convertDatabaseRowToNotionPage(row);
	}

	public getMostRecentEditedPage(): NotionPage | null {
		const query = db.query(
			`SELECT * FROM ${notionPagesTableName} ORDER BY last_edited_time DESC LIMIT 1`,
		);
		const queryResult = query.all();

		if (queryResult.length === 0) {
			return null;
		}

		if (queryResult.length > 1) {
			throw new Error("Multiple pages found with the same last edited time");
		}

		const row = queryResult[0] as any;
		return convertDatabaseRowToNotionPage(row);
	}
}
