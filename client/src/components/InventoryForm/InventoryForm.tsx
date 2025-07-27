import type React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface InventoryFormProps {
    name: string;
    quantity: number;
    onNameChange: (name: string) => void;
    onQuantityChange: (quantity: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    canSubmit: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
    name,
    quantity,
    onNameChange,
    onQuantityChange,
    onSubmit,
    isSubmitting,
    canSubmit,
}) => {
    const { colors } = useTheme();

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "0.75rem",
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        fontSize: "1rem",
        backgroundColor: colors.surface,
        color: colors.text,
        transition: "all 0.3s ease",
        outline: "none",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: "600",
        color: colors.text,
    };

    const buttonStyle: React.CSSProperties = {
        width: "100%",
        padding: "1rem",
        backgroundColor: !canSubmit ? colors.secondary : colors.primary,
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: !canSubmit ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        opacity: !canSubmit ? 0.6 : 1,
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = colors.primary;
        e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`;
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = colors.border;
        e.target.style.boxShadow = "none";
    };

    const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (canSubmit) {
            e.currentTarget.style.backgroundColor = colors.primaryHover;
            e.currentTarget.style.transform = "translateY(-2px)";
        }
    };

    const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (canSubmit) {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.transform = "translateY(0)";
        }
    };

    return (
        <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
            <div>
                <label htmlFor="name" style={labelStyle}>
                    🏷️ Item Name:
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Enter item name"
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                />
            </div>

            <div>
                <label htmlFor="quantity" style={labelStyle}>
                    🔢 Quantity:
                </label>
                <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={!canSubmit}
                style={buttonStyle}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
            >
                {isSubmitting ? "📤 Uploading..." : "📦 Add to Inventory"}
            </button>
        </form>
    );
};
