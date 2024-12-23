import process from "node:process";
import { ratings, readFile, saveFile } from "./utils.ts";
import { services } from "./data/services.ts";
import { type UI, uis } from "./data/uis.ts";
import { type Checkpoint, checkpoints } from "./data/checkpoints.ts";
import templatesData from "./data/templates.json" with { type: "json" };

// Check if templatesData contains at least one key
if (!Object.keys(templatesData).length) {
  console.error("No templates found");
  process.exit(1);
}

export interface Template {
  // checkpoint ID
  [key: typeof checkpoints[number]["id"]]: {
    // service ID
    [key: keyof typeof services]: {
      // UI ID
      [key: typeof uis[number]["id"]]: {
        id: string;
        hash: string;
      };
    };
  };
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

console.log(sdxlTemplates);
console.log(pdxlTemplates);

const tableRow = (ckpt: Checkpoint) => {
  const template = templates[ckpt.id!];
  return `| <a href="${ckpt.homepage}">${ckpt.name}</a> | v${ckpt.version} | ${link("vastai", template.vastai.forge, "forge")} | ${
    link("vastai", template.vastai.comfy, "comfy")
  } |`;
};

readme = readme.replace(
  /^.+{{sdxlStarters}}.*$/gm,
  `${
    checkpoints
      .filter((x) => x.base === "sdxl")
      .map((x) => tableRow(x))
      .join("\n")
  }`,
);

readme = readme.replace(
  /^.+{{pdxlStarters}}.*$/gm,
  `${
    checkpoints
      .filter((x) => x.base === "pdxl")
      .map((x) => tableRow(x))
      .join("\n")
  }`,
);

await saveFile("README.md", readme);
