import process from "node:process";
import { rm } from "node:fs/promises";

import {
  createVastaiTemplate,
  executeCommand,
  getBranchName,
  getEnvironmentVariable,
  pvsUrl,
  readFile,
  runtime,
  saveFile,
} from "./utils.ts";

import { uis } from "./data/uis.ts";
import { repositories } from "./data/repositories.ts";
import { type Checkpoint, checkpoints } from "./data/checkpoints.ts";
import { embeddings } from "./data/embeddings.ts";
import { loras } from "./data/loras.ts";
import { vaes } from "./data/vaes.ts";
import { controlnets } from "./data/controlnets.ts";
import { upscalers } from "./data/upscalers.ts";
import { extensions } from "./data/extensions.ts";
import { services } from "./data/services.ts";

import t from "./data/templates.json" with { type: "json" };

export interface Template {
  // checkpoint ID
  [key: typeof checkpoints[number]["id"]]: {
    // service ID
    [key: keyof typeof services]: {
      // UI ID
      [key: typeof uis[number]["id"]]: string;
    };
  };
}

let templates = t as Template;

// Clean up old scripts
await rm("scripts", { recursive: true, force: true });

// Remove double slashes in URLs
const url = (url: string) => new URL(url).href.replace(/(?<!:)(\/\/)/g, "/");

console.log(`Detected runtime: ${runtime?.toLocaleUpperCase()}`);

const branch = await getBranchName();

console.log(`Working on branch: ${branch}`);

const vastaiCli = await fetch(
  // "https://raw.githubusercontent.com/vast-ai/vast-python/master/vast.py",
  "https://raw.githubusercontent.com/Avaray/vast-cli/refs/heads/master/vast.py",
);

if (!vastaiCli.ok) {
  console.error(`Error downloading VastAI CLI: ${vastaiCli.statusText}`);
  process.exit(1);
}

await saveFile("vastai", await vastaiCli.text());

console.log(`VastAI CLI downloaded successfully`);

const vastaiApiKey = await getEnvironmentVariable("VASTAI_KEY") || "";

if (!vastaiApiKey) {
  console.error("VASTAI_KEY environment variable is not set");
  process.exit(1);
}

// Add API key to VastAI CLI
await executeCommand("python", ["vastai", "set", "api-key", vastaiApiKey]);

console.log(`VastAI API key set successfully`);

// Iterate over all UIs
for (const ui of uis) {
  console.log(`Processing UI: ${ui.name}`);

  // Currently it's just a shebang
  const header: string = [
    "#!/bin/bash",
    "\n\n",
  ].join("");

  // Remove all comments
  ui.pvs = ui.pvs.replace(/^\s*?#+\s?[\w\W]*?$/gm, "\n");
  // Clean empty tuples
  ui.pvs = ui.pvs.replace(/\([\s\r\n]*?\)/gm, "()");
  // Remove everything before first variable assignment
  ui.pvs = ui.pvs.replace(/^[\w\W]*?(?=\w+=)/m, "\n");
  // Add header to the beginning of the script
  ui.pvs = `${header}\n\n${ui.pvs}`;
  // Set DISK_GB_REQUIRED to 40 (default is 30)
  ui.pvs = ui.pvs.replace(/^DISK_GB_REQUIRED.*$/gm, "DISK_GB_REQUIRED=40");

  // Iterate over all checkpoints
  for (const checkpoint of checkpoints as Checkpoint[]) {
    let pvs = ui.pvs;

    // Find all extensions for the checkpoint
    const extensionUrls = extensions
      .filter((extension) => extension.base.includes(checkpoint.base))
      .map((extension) => extension.url);

    // Replace EXTENSIONS list
    pvs = pvs.replace(
      /EXTENSIONS=\(.*?\)/gms,
      `EXTENSIONS=(\n${extensionUrls.map((x) => `    '${x}'`).join("\n")}\n)`,
    );

    // Replace CHECKPOINT_MODELS list
    pvs = pvs.replace(
      /CHECKPOINT_MODELS=\(.*?\)/gms,
      `CHECKPOINT_MODELS=(\n    '${
        url(
          `${repositories[checkpoint.base]}/CHECKPOINT/${checkpoint.filename}`,
        )
      }'\n)`,
    );

    // Find all VAE models for the checkpoint
    const vaeModels = vaes
      .filter((vae) => vae.base.includes(checkpoint.base))
      .map((vae) => vae.filename);

    // Replace VAE_MODELS list
    pvs = pvs.replace(
      /VAE_MODELS=\(.*?\)/gms,
      `VAE_MODELS=(\n${
        vaeModels.map((x) => `    '${url(`${repositories[checkpoint.base]}/VAE/${x}`)}'`).join("\n")
      }\n)`,
    );

    // Find all Lora models where base is checkpoint base
    const loraModels = loras
      .filter((lora) => lora.base.includes(checkpoint.base))
      .map((lora) => lora.filename);

    // Replace LORA_MODELS with all Lora models
    pvs = pvs.replace(
      /LORA_MODELS=\(.*?\)/gms,
      `LORA_MODELS=(\n${
        loraModels.map((x) => `    '${url(`${repositories[checkpoint.base]}/LORA/${x}`)}'`).join("\n")
      }\n)`,
    );

    // Find all ControlNet models where base is checkpoint base
    const controlnetModels = controlnets
      .filter((controlnet) => controlnet.base.includes(checkpoint.base))
      .map((controlnet) => controlnet.filename);

    // Replace CONTROLNET_MODELS with all ControlNet models
    pvs = pvs.replace(
      /CONTROLNET_MODELS=\(.*?\)/gms,
      `CONTROLNET_MODELS=(\n${
        controlnetModels.map((x) => `    '${url(`${repositories[checkpoint.base]}/CONTROLNET/${x}`)}'`).join("\n")
      }\n)`,
    );

    // Find all Upscaler models where base is checkpoint base
    const upscalerModels = upscalers
      .filter((upscaler) => upscaler.base.includes(checkpoint.base))
      .map((upscaler) => upscaler.filename);

    // Replace ESRGAN_MODELS (upscalers) with all Upscaler models
    pvs = pvs.replace(
      /ESRGAN_MODELS=\(.*?\)/gms,
      `ESRGAN_MODELS=(\n${
        upscalerModels.map((x) => `    '${url(`${repositories[checkpoint.base]}/ESRGAN/${x}`)}'`).join("\n")
      }\n)`,
    );

    // List all Embeddings that are compatible with the checkpoint and type === 'positive'
    const embeddingsPositive = embeddings
      .filter((embedding) =>
        embedding.base.includes(checkpoint.base) &&
        embedding.type === "positive"
      )
      .map((embedding) => embedding.filename);

    // List all Embeddings that are compatible with the checkpoint and type === 'negative'
    const embeddingsNegative = embeddings
      .filter((embedding) =>
        embedding.base.includes(checkpoint.base) &&
        embedding.type === "negative"
      )
      .map((embedding) => embedding.filename);

    if (["forge", "comfy"].includes(ui.id)) {
      pvs = pvs.replace(
        /^function provisioning_start/m,
        `EMBEDDINGS_POSITIVE=(\n${
          embeddingsPositive.map((x) => `    '${url(`${repositories[checkpoint.base]}/EMBEDDINGS/pos/${x}`)}'`).join(
            "\n",
          )
        }\n)\n\nfunction provisioning_start`,
      );
      pvs = pvs.replace(
        /^function provisioning_start/m,
        `EMBEDDINGS_NEGATIVE=(\n${
          embeddingsNegative.map((x) => `    '${url(`${repositories[checkpoint.base]}/EMBEDDINGS/neg/${x}`)}'`).join(
            "\n",
          )
        }\n)\n\nfunction provisioning_start`,
      );
    }

    if (["comfy", "forge"].includes(ui.id)) {
      pvs = pvs.replace(
        /provisioning_get_models \\/m,
        `provisioning_get_models \\\n        "\${WORKSPACE}/storage/stable_diffusion/${
          ui.id === "comfy" ? "models/" : ""
        }embeddings/positive" \\\n        "\${EMBEDDINGS_POSITIVE[@]}"\n    provisioning_get_models \\`,
      );
      pvs = pvs.replace(
        /provisioning_get_models \\/m,
        `provisioning_get_models \\\n        "\${WORKSPACE}/storage/stable_diffusion/${
          ui.id === "comfy" ? "models/" : ""
        }embeddings/negative" \\\n        "\${EMBEDDINGS_NEGATIVE[@]}"\n    provisioning_get_models \\`,
      );
    }

    // Remove multiple empty lines
    pvs = pvs.replace(/^\n{2,}/gm, "\n");

    await saveFile(`scripts/${ui.id}/${checkpoint.id}.sh`, pvs);

    const templateVastai = await createVastaiTemplate(
      `${ui.name}UI - ${checkpoint.name} V${checkpoint.version.toUpperCase()} - Stable Diffusion Quickstart (${checkpoint.base.toUpperCase()})`,
      ui.image,
      ui.env,
      pvsUrl(ui, branch, checkpoint.id!),
    );

    console.log(templateVastai);

    if (templateVastai) {
      console.log(
        `Template for ${ui.name}UI with ${checkpoint.name} created with id ${templateVastai}`,
      );
      // templates[checkpoint.id!].vastai[ui.id] = template.id;
      if (!templates[checkpoint.id!]) {
        templates[checkpoint.id!] = { vastai: {} };
      }
      if (!templates[checkpoint.id!].vastai) {
        templates[checkpoint.id!].vastai = {};
      }
      templates[checkpoint.id!].vastai.id = templateVastai;
    } else {
      console.error(
        `Error creating template for ${ui.name}UI with ${checkpoint.name}`,
      );
    }
  }
}

await saveFile("data/templates.json", JSON.stringify(templates, null, 2));

console.log("Done");
