import { generateLabel } from "../label/generate-label";
import { printLabel } from "../label/print-label";

export class LabelService {
	// async generateLabel(args: Parameters<typeof generateLabel>): Promise<string> {
	//     return await generateLabel(...args);
	// }

	generateLabel = generateLabel;
	printLabel = printLabel;
}
