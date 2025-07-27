import { exec } from "node:child_process";

export const printLabel = async (filePath: string) => {
	console.log("🖨 Printing label:", filePath);
	exec(`lp "${filePath}"`, (error) => {
		if (error) console.error("Print error:", error);
	});
};
