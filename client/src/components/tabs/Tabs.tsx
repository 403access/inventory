import { useState } from "react";
import { DatabasesPage } from "../../pages/DatabasesPage";
import { FilesPage } from "../../pages/FilesPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { PagesPage } from "../../pages/PagesPage";
import { Button } from "../Button";

export const tabs = {
    inventory: "Inventory",
    databases: "Databases",
    pages: "Pages",
    files: "Files",
};

export const Tabs = () => {
    const [activeTab, setActiveTab] = useState("inventory");

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
        backgroundColor: activeTab === tab ? "#007bff" : "#f8f9fa",
        color: activeTab === tab ? "#fff" : "#000",
        cursor: "pointer",
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
        <div style={{ padding: "2rem" }}>
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
                            borderRadius: getBorderRadius(tabEntries.length, index)
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