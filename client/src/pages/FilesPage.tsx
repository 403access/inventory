import { useQuery } from "@tanstack/react-query";
import type { NotionFile } from "../../../server/src/repositories/NotionFilesRepository";
import { FileView } from "../components/files/FileView";
import { Page } from "../components/Page";
import { fetchFiles } from "../utils/api";

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
