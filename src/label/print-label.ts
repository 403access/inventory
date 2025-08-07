import { exec } from "node:child_process";
import { log } from "../log/app-logger";

export const printLabel = async (filePath: string) => {
	log("🖨 Printing label:", filePath);
	exec(`lp "${filePath}"`, (error) => {
		if (error) log("Print error:", error);
	});
};
