import * as fs from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "canvas";
import QRCode from "qrcode";
import { log } from "../log/app-logger";

//
//     Label dimensions
//
//     ┌─────────────────────────────────────────────────────────┐
//     │  5px margin                               20px margin   │
//     │  ┌────────┐  20px spacing                               │
//     │  │        │  ┌─────────────────────────────────────┐    │
//     │  │   QR   │  │  Text Area with Auto-Wrapping       │    │
//     │  │  Code  │  │  - Multiple lines if needed         │    │
//     │  │ 120x120│  │  - Dynamic font sizing              │    │
//     │  │        │  │  - Proper word breaks               │    │
//     │  └────────┘  └─────────────────────────────────────┘    │
//     │                                                         │
//     └─────────────────────────────────────────────────────────┘
//        400px width × 300px height

interface LabelDimensions {
	width: number;
	height: number;
	leftMargin: number;
	rightMargin: number;
	qrSize: number;
	topMargin: number;
	bottomMargin: number;
}

interface TextArea {
	startX: number;
	endX: number;
	width: number;
	startY: number;
	endY: number;
	height: number;
}

const getLabelDimensions = (): LabelDimensions => ({
	width: 400,
	height: 300,
	leftMargin: 5,
	rightMargin: 20,
	qrSize: 120,
	topMargin: 40,
	bottomMargin: 40,
});

const createLabelCanvas = (dimensions: LabelDimensions) => {
	const canvas = createCanvas(dimensions.width, dimensions.height);
	const ctx = canvas.getContext("2d");

	// Fill background
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, dimensions.width, dimensions.height);

	return { canvas, ctx };
};

const drawQRCode = async (
	ctx: any,
	link: string,
	dimensions: LabelDimensions,
) => {
	const qrX = dimensions.leftMargin;
	const qrY = (dimensions.height - dimensions.qrSize) / 2;

	const qrCanvas = createCanvas(dimensions.qrSize, dimensions.qrSize);
	await QRCode.toCanvas(qrCanvas as any, link);
	ctx.drawImage(qrCanvas as any, qrX, qrY);
};

const calculateTextArea = (dimensions: LabelDimensions): TextArea => {
	const startX = dimensions.leftMargin + dimensions.qrSize + 20; // 20px spacing after QR
	const endX = dimensions.width - dimensions.rightMargin;

	return {
		startX,
		endX,
		width: endX - startX,
		startY: dimensions.topMargin,
		endY: dimensions.height - dimensions.bottomMargin,
		height: dimensions.height - dimensions.bottomMargin - dimensions.topMargin,
	};
};

const wrapText = (
	ctx: any,
	text: string,
	maxWidth: number,
	fontSize: number,
): string[] => {
	ctx.font = `bold ${fontSize}px Sans`;
	const words = text.split(" ");
	const lines: string[] = [];
	let currentLine = "";

	for (const word of words) {
		const testLine = currentLine ? `${currentLine} ${word}` : word;
		const testWidth = ctx.measureText(testLine).width;

		if (testWidth <= maxWidth) {
			currentLine = testLine;
		} else {
			if (currentLine) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				// Single word is too long, force it
				lines.push(word);
				currentLine = "";
			}
		}
	}

	if (currentLine) {
		lines.push(currentLine);
	}

	return lines;
};

const calculateOptimalFontSize = (
	ctx: any,
	text: string,
	textArea: TextArea,
	maxFontSize: number = 28,
	minFontSize: number = 12,
): { fontSize: number; lines: string[]; lineHeight: number } => {
	let fontSize = maxFontSize;
	let lines: string[] = [];
	let lineHeight = fontSize * 1.2;

	while (fontSize >= minFontSize) {
		lines = wrapText(ctx, text, textArea.width, fontSize);
		lineHeight = fontSize * 1.2;
		const totalTextHeight = lines.length * lineHeight;

		if (totalTextHeight <= textArea.height) {
			break; // Text fits!
		}

		fontSize -= 2; // Reduce font size and try again
	}

	return { fontSize, lines, lineHeight };
};

const drawText = (
	ctx: any,
	lines: string[],
	textArea: TextArea,
	fontSize: number,
	lineHeight: number,
) => {
	ctx.fillStyle = "black";
	ctx.font = `bold ${fontSize}px Sans`;

	const totalTextHeight = lines.length * lineHeight;
	const startY =
		textArea.startY + (textArea.height - totalTextHeight) / 2 + fontSize;

	lines.forEach((line, index) => {
		const y = startY + index * lineHeight;
		ctx.fillText(line, textArea.startX, y);
	});
};

const saveLabelToFile = async (
	canvas: any,
	labelDir: string,
	id: string,
): Promise<{ labelPath: string; labelFileName: string }> => {
	const labelFileName = `label_${id}.png`;
	const labelPath = path.join(labelDir, labelFileName);
	await fs.writeFile(labelPath, canvas.toBuffer("image/png"));
	return { labelPath, labelFileName };
};

export const generateLabel = async (
	labelDir: string,
	name: string,
	link: string,
	id: string,
) => {
	log("🧾 Generating label with ID:", id);

	const dimensions = getLabelDimensions();
	const { canvas, ctx } = createLabelCanvas(dimensions);

	await drawQRCode(ctx, link, dimensions);

	const textArea = calculateTextArea(dimensions);
	const { fontSize, lines, lineHeight } = calculateOptimalFontSize(
		ctx,
		name,
		textArea,
	);

	drawText(ctx, lines, textArea, fontSize, lineHeight);

	return await saveLabelToFile(canvas, labelDir, id);
};
