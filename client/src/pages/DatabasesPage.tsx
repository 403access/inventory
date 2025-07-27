import { useQuery } from "@tanstack/react-query";
import { DatabaseView } from "../components/databases/DatabaseView";
import { Page } from "../components/Page";
import { fetchFiles } from "../utils/api";

export type NotionDatabase = {
    id: string;
    title: string;
    url: string;
    created_time: string;
    last_edited_time: string | null;
};

export const DatabasesPage = () => {
    const query = useQuery({
        queryKey: ["notion-databases"],
        queryFn: () => fetchFiles<NotionDatabase[]>("/notion/databases"),
    });
    return (
        <Page<NotionDatabase>
            title="📚 Databases Page"
            {...query}
            render={({ data: database }) => <DatabaseView key={database.id} database={database} />}
        />
    );
};
