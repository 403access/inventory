//
// As of now this is a manual test.
// It generates a label and saves it to the file system.
// You can then print it using your label printer software.
//
// To make it an automated test, the current checked in version
// of the generated label should be used as a reference.
// Basically, snapshot testing for the label generation.
//
import { generateLabel } from "../label/generate-label";

const testData = [
	{
		itemName: "Seagate IronWolf NAS HDD 8TB, SATA 6Gb/s",
		shortLink: "https://link.olimo.me/inventory/6",
		notionId: "INVENTORY-6",
	},
	{
		itemName: "AirPods Pro",
		shortLink: "https://link.olimo.me/inventory/8",
		notionId: "INVENTORY-8",
	},
	{
		itemName:
			"Zeegma Luftbefeuchter VERS UV GRAND, Leiser Betrieb8-LiterBehälter3 Befeuchtungsmodi",
		shortLink: "https://link.olimo.me/inventory/17",
		notionId: "INVENTORY-17",
	},
];

const testGenerateLabel = async () => {
	const labelDir = "./temp";

	try {
		for (const { itemName, shortLink, notionId } of testData) {
			console.log(`Generating label for: ${itemName}`);

			const { labelPath, labelFileName } = await generateLabel(
				labelDir,
				itemName,
				shortLink,
				notionId,
			);
			console.log(`Label generated: ${labelPath}`);
			console.log(`Label file name: ${labelFileName}`);
		}
	} catch (error) {
		console.error("Error generating label:", error);
	}
};

testGenerateLabel()
	.then(() => console.log("Label generation test completed successfully."))
	.catch((error) => console.error("Label generation test failed:", error));
