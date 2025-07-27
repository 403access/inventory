export type ButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    styles?: React.CSSProperties;
};

export const Button = ({ children, onClick, styles }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "0.5rem 1rem",
                border: "none",
                outline: "none",
                ...styles,
            }}
            type="button"
        >
            {children}
        </button>
    );
};