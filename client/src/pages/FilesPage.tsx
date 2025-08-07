import { useQuery } from "@tanstack/react-query";
import { FileView } from "../components/files/FileView";
import { Page } from "../components/Page";
import { fetchFiles } from "../utils/api";

export type NotionFile = {
    id: string;
    page_id: string;
    file_url: string;
    created_time: string;
    last_edited_time: string | null;
};

export const FilesPage = () => {
    const query = useQuery({
        queryKey: ["notion-files"],
        queryFn: () => fetchFiles<NotionFile[]>("/notion/files"),
    });
    return (
        <Page<NotionFile>
            title="📂 Files Page"
            {...query}
            render={({ data: file }) => <FileView key={file.id} file={file} />}
        />
    );
};
