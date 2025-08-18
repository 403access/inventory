import { useQuery } from "@tanstack/react-query";
import type { NotionDatabase } from "../../../server/src/repositories/NotionDatabaseRepository";
import { DatabaseView } from "../components/databases/DatabaseView";
import { Page } from "../components/Page";
import { fetchFiles } from "../utils/api";

export const DatabasesPage = () => {
	const query = useQuery({
		queryKey: ["notion-databases"],
		queryFn: () => fetchFiles<NotionDatabase[]>("/notion/databases"),
	});
	return (
		<Page<NotionDatabase>
			title="📚 Databases Page"
			{...query}
			render={({ data: database }) => (
				<DatabaseView key={database.id} database={database} />
			)}
		/>
	);
};
