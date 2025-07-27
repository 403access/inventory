import * as fs from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "canvas";
import QRCode from "qrcode";

export const generateLabel = async (
	labelDir: string,
	name: string,
	link: string,
	id: string,
) => {
	console.log("🧾 Generating label with ID:", id);
	const width = 400;
	const height = 150;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);

	const qrSize = 120;
	const textSize = 28;
	ctx.font = `bold ${textSize}px Sans`;
	ctx.fillStyle = "black";

	const textWidth = ctx.measureText(name).width;

	const spacing = 20;
	const totalWidth = qrSize + spacing + textWidth;
	const startX = (width - totalWidth) / 2;
	const qrX = startX;
	const textX = startX + qrSize + spacing;
	const centerY = height / 2;

	const qrCanvas = createCanvas(qrSize, qrSize);
	await QRCode.toCanvas(qrCanvas, link);

	ctx.drawImage(qrCanvas, qrX, centerY - qrSize / 2);
	ctx.fillText(name, textX, centerY + textSize / 2 - 4);

	const labelPath = path.join(labelDir, `label_${id}.png`);
	await fs.writeFile(labelPath, canvas.toBuffer("image/png"));
	return labelPath;
};
