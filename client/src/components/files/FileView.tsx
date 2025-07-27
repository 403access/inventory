import type { NotionFile } from "../../pages/FilesPage"

export const FileView = ({ file }: { file: NotionFile }) => {
    return <div
        key={file.page_id}
        style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
        }}
    >
        <div>{file.page_id}</div>
        <div>
            <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                Open in Notion
            </a>
        </div>
        <div>
            Created: {new Date(file.created_time).toLocaleString()}
        </div>
        <div>
            Last Edited: {file.last_edited_time ? new Date(file.last_edited_time).toLocaleString() : "Never"}
        </div>

        <img src={file.file_url} alt={file.file_url} style={{ maxWidth: "100%", borderRadius: "8px" }} />
    </div>
}