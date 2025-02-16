import process from "node:process";
import { ratings, readFile, saveFile } from "./utils.ts";
import { services } from "./data/services.ts";
import { type UI, uis } from "./data/uis.ts";
import { type Checkpoint, checkpoints } from "./data/checkpoints.ts";
import templatesData from "./data/templates.json" with { type: "json" };
import type { Template } from "./index.ts";

// Check if templatesData contains at least one key
if (!Object.keys(templatesData).length) {
  console.error("No templates found");
  process.exit(1);
}

const templates = templatesData as Template;

let readme = await readFile("src/README.md");

const link = (service: string, templateId: string, uiId: string) => {
  const { url } = services[service];
  const _ui = uis.find((ui) => ui.id === uiId);
  return `<a href="${url}${templateId}">${_ui?.name}</a>`;
};

// const sdxlTemplates = checkpoints.filter((ckpt) => ckpt.base === "sdxl").map((ckpt) => ckpt.id);
// const pdxlTemplates = checkpoints.filter((ckpt) => ckpt.base === "pdxl").map((ckpt) => ckpt.id);

const table = (templates: Template) => {
  return `| Rating | Checkpoint<br>Name | Version | ${uis.map((x) => "").join(" | ")} |
          | :-: | :-: | :-: | ${uis.map(() => ":-:").join(" | ")} |
          ${
    checkpoints
      .map((ckpt) => {
        return `| ${ckpt.rating ? ratings[ckpt.rating][0] : ""} | ${ckpt.name} | ${ckpt.version} | ${
          uis
            .map((ui) => {
              const hash = templates[ckpt.id]["vastai"][ui.id].hash;
              console.log(hash);
              return link("vastai", hash, ui.id);
            })
            .join(" | ")
        } |`;
      })
      .join("\n")
  }`.replace(/^\s+/gm, "");
};

readme = readme.replace(
  /^.*{{sdxlTemplates}}.*$/gm,
  `${
    checkpoints
      .filter((ckpt) => ckpt.base === "sdxl")
      .map((ckpt) => templates[ckpt.id])
      .map(() => table(templates))
      .join("\n\n")
  }`,
);

// process.exit(0);

await saveFile("README.md", readme);
