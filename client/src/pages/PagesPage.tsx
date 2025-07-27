import { useQuery } from "@tanstack/react-query";
import { Page } from "../components/Page";
import { fetchFiles } from "../utils/api";
import { PageView } from "../components/pages/PageView";

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


export const PagesPage = () => {
    const query = useQuery({
        queryKey: ["notion-pages"],
        queryFn: () => fetchFiles<NotionPage[]>("/notion/pages"),
    });
    return (
        <Page<NotionPage>
            title="📄 Pages Page"
            {...query}
            render={({ data: page }) => <PageView key={page.id} page={page} />}
        />
    );
};
