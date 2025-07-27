import type { NotionPage } from "../../pages/PagesPage"

export const PageView = ({ page }: { page: NotionPage }) => {
    return <div
        key={page.id}
        style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
        }}
    >
        <div style={{ fontWeight: "bold" }}>{page.title}</div>
        <div>{page.id}</div>
        <div>
            <a href={page.link} target="_blank" rel="noopener noreferrer">
                Open in Notion
            </a>
        </div>
        <div>
            Database Id: {page.database_id}
        </div>
        <div>
            Quantity: {page.quantity}
        </div>
        <div>
            Created: {new Date(page.created_time).toLocaleString()}
        </div>

        <div>
            Last Edited: {page.last_edited_time ? new Date(page.last_edited_time).toLocaleString() : "Never"}
        </div>
    </div>
}