import type { NotionDatabase } from "../../pages/DatabasesPage"

export const DatabaseView = ({ database }: { database: NotionDatabase }) => {
    return <div
        key={database.id}
        style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
        }}
    >
        <div style={{ fontWeight: "bold" }}>{database.title}</div>
        <div>{database.id}</div>
        <div>
            <a href={database.url} target="_blank" rel="noopener noreferrer">
                Open in Notion
            </a>
        </div>
        <div>
            Created: {new Date(database.created_time).toLocaleString()}
        </div>

        <div>
            Last Edited: {database.last_edited_time ? new Date(database.last_edited_time).toLocaleString() : "Never"}
        </div>
    </div>
}