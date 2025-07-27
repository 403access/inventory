import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { DatabasesPage } from "../../pages/DatabasesPage";
import { FilesPage } from "../../pages/FilesPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { PagesPage } from "../../pages/PagesPage";
import { Button } from "../Button";
import { ThemeToggle } from "../ThemeToggle";

export const tabs = {
    inventory: "Inventory",
    databases: "Databases",
    pages: "Pages",
    files: "Files",
};

export const Tabs = () => {
    const [activeTab, setActiveTab] = useState("inventory");
    const { colors } = useTheme();

    const getBorderRadius = (length: number, index: number) => {
        const value = "4px";

        if (length === 0) throw new Error("Length must be greater than 0");

        // If there's only one tab, apply border radius to all corners
        if (length === 1) return value;

        // Top left and bottom left corners
        if (index === 0) return `8px 0 0 ${value}`;

        // Top right and bottom right corners
        if (index === length - 1) return `0 ${value} ${value} 0`;

        // Middle tabs have no border radius
        return "0";
    };

    const getAdditionalStyles = (tab: string) => ({
        backgroundColor: activeTab === tab ? colors.primary : colors.surface,
        color: activeTab === tab ? "#fff" : colors.text,
        cursor: "pointer",
        border: `1px solid ${colors.border}`,
        transition: "all 0.3s ease",
    });

    const getPage = (tab: string) => {
        switch (tab) {
            case "inventory":
                return <InventoryPage />;
            case "databases":
                return <DatabasesPage />;
            case "pages":
                return <PagesPage />;
            case "files":
                return <FilesPage />;
            default:
                return null;
        }
    };

    const tabEntries = Object.entries(tabs);

    return (
        <div
            style={{
                padding: "2rem",
                minHeight: "100vh",
                backgroundColor: colors.background,
                color: colors.text,
                transition: "all 0.3s ease",
            }}
        >
            <ThemeToggle />
            <div
                style={{
                    margin: "1rem 0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                {tabEntries.map(([key, value], index) => (
                    <Button
                        key={key}
                        styles={{
                            ...getAdditionalStyles(key),
                            borderRadius: getBorderRadius(tabEntries.length, index),
                        }}
                        onClick={() => setActiveTab(key)}
                    >
                        {value}
                    </Button>
                ))}
            </div>

            <div>{getPage(activeTab)}</div>
        </div>
    );
};
