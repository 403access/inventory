import { useTheme } from "../../contexts/ThemeContext";

export interface PageProps<T> {
    title: string
    isLoading: boolean
    isError: boolean
    error: Error | null
    data?: T[]
    render: ({ data }: { data: T }) => React.ReactNode
}

export const Page = <T,>({
    children, title, isLoading, isError, error, data, render
}: React.PropsWithChildren<PageProps<T>>) => {
    const { colors } = useTheme();

    return (
        <div style={{ 
            minHeight: "100vh",
            backgroundColor: colors.background,
            color: colors.text,
            padding: "1rem"
        }}>
            {false && <h1 style={{ color: colors.text }}>{title}</h1>}

            {isLoading && (
                <p style={{ 
                    color: colors.textSecondary,
                    textAlign: "center",
                    fontSize: "1.1rem"
                }}>
                    ⏳ Loading...
                </p>
            )}

            {isError && error && (
                <p style={{ 
                    color: colors.error,
                    backgroundColor: `${colors.error}20`,
                    padding: "1rem",
                    borderRadius: "8px",
                    border: `1px solid ${colors.error}`
                }}>
                    ❌ {error.message}
                </p>
            )}

            {data && data.length === 0 && (
                <p style={{ 
                    color: colors.textSecondary,
                    textAlign: "center",
                    fontSize: "1.1rem"
                }}>
                    📭 No uploaded files yet.
                </p>
            )}

            {data && data.length > 0 && (<>
                <p style={{ color: colors.text }}>Found {data.length} databases.</p>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {data.map(data => render({ data }))}
                </div>
            </>)}

            {children}
        </div>
    );
}