import { executeCommand, saveFile } from "./utils";

import templates from "./data/templates.json" with { type: "json" };

const toDelete = JSON.stringify(templates).match(/\d{6,12}/g) || [];

if (!toDelete.length) {
  console.error("No templates to delete");
  process.exit(1);
}

console.log(`Deleting ${toDelete.length} templates`);

const startTime = Date.now();

for (const id of toDelete) {
  const deleteTemplate = await executeCommand("vastai", ["delete", "template", `--template`, id]);

  if (deleteTemplate.success) {
    console.log(`Template with id ${id} deleted successfully`);
  }
}

await saveFile("data/templates.json", JSON.stringify({}, null, 2) + "\n");

const msToSeconds = (ms: number) => Math.floor(ms / 1000);

console.log(`Deleted ${toDelete.length} templates in ${msToSeconds(Date.now() - startTime)} seconds`);
