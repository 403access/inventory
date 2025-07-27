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
    return (
        <div>
            {false && <h1>{title}</h1>}

            {isLoading && <p>Loading...</p>}

            {isError && error && <p style={{ color: "red" }}>{error.message}</p>}

            {data && data.length === 0 && <p>No uploaded files yet.</p>}

            {data && data.length > 0 && (<>
                <p>Found {data.length} databases.</p>
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