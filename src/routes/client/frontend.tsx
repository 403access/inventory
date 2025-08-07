// import "./styles.css";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
        console.error("Root element not found");
        return;
    }
    const root = createRoot(rootElement);
    root.render(<App />);
});