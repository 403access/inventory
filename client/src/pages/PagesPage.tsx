import { useQuery } from "@tanstack/react-query";
import type { NotionPage } from "../../../server/src/repositories/NotionPagesRepository";
import { Page } from "../components/Page";
import { PageView } from "../components/pages/PageView";
import { fetchFiles } from "../utils/api";

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
