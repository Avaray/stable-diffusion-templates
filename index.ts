import { rm } from "node:fs/promises";

import {
  executeCommand,
  getIds,
  getBranchName,
  getEnvironmentVariable,
  normalizeFilename,
  runtime,
  saveFile,
  pvsUrl,
} from "./utils";

import { uis } from "./data/uis";
import { repositories } from "./data/repositories";
import { type Checkpoint, checkpoints } from "./data/checkpoints";
import { embeddings } from "./data/embeddings";
import { loras } from "./data/loras";
import { vaes } from "./data/vaes";
import { controlnets } from "./data/controlnets";
import { upscalers } from "./data/upscalers";
import { extensions } from "./data/extensions";

import t from "./data/templates.json" with { type: "json" };

let templates = t as any;

const branch = await getBranchName();

await rm("scripts", { recursive: true, force: true });

const url = (url: string) => new URL(url).href.replace(/(?<!:)(\/\/)/g, "/");

console.log(`Detected runtime: ${runtime?.toLocaleUpperCase()}`);

// Install VastAI CLI
const vastaiInstall = await executeCommand("pip", [
  "install",
  "--upgrade",
  "vastai",
]);

if (vastaiInstall.success) {
  console.log(`VastAI CLI installed successfully`);
} else {
  console.error(`Error installing VastAI: ${vastaiInstall.error}`);
  process.exit(1);
}

const vastaiApiKey = await getEnvironmentVariable("VASTAI_KEY") || "";

if (!vastaiApiKey) {
  console.error("VASTAI_KEY environment variable is not set");
  process.exit(1);
}

// Add API key to VastAI CLI
await executeCommand("vastai", ["set", "api-key", vastaiApiKey]);

async function createVastaiTemplate(
  name: string,
  pvsUrl: string,
  image: string,
  flags: string,
) {
  const createTemplate = await executeCommand("vastai", [
    "create",
    "template",
    "--disk_space",
    40.0,
    "--name",
    name,
    "--image",
    image,
    "--image_tag",
    "latest",
    "--onstart-cmd",
    "env | grep _ >> /etc/environment; /opt/ai-dock/bin/init.sh;",
    "--env",
    `-e DATA_DIRECTORY=/workspace/ -e WORKSPACE=/workspace/ -e WORKSPACE_MOUNTED=force -e SYNCTHING_TRANSPORT_PORT_HOST=72299 -p 8384:8384 -p 72299:72299 -e JUPYTER_DIR=/ -e WEBUI_BRANCH=master -e WEBUI_FLAGS=\"${flags}\" -e JUPYTER_PASSWORD=password -e PROVISIONING_SCRIPT=\"${pvsUrl}\" -p 22:22 -p 1111:1111 -p 7860:7860 -p 8888:8888 -e OPEN_BUTTON_TOKEN=1 -e OPEN_BUTTON_PORT=1111`,
    "--jupyter",
    "--direct",
  ]);

  const ids = getIds(createTemplate.output);

  return ids;
}

async function deleteVastaiTemplate(id: number) {
  const deleteTemplate = await executeCommand("vastai", [
    "delete",
    "template",
    `--template`,
    id,
  ]);
}

// Iterate over all UIs
for (const ui of uis) {
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

    // Find all extensions where base is checkpoint base
    const extensionUrls = extensions
      .filter((extension) => extension.base.includes(checkpoint.base))
      .map((extension) => extension.url);

    // Replace EXTENSIONS list
    // TODO: Need to change logic here, look at extensions list, it contains uis array
    pvs = pvs.replace(
      /EXTENSIONS=\(.*?\)/gms,
      `EXTENSIONS=(\n${extensionUrls.map((x) => `    '${x}'`).join("\n")}\n)`,
    );

    // Replace CHECKPOINT_MODELS list
    pvs = pvs.replace(
      /CHECKPOINT_MODELS=\(.*?\)/gms,
      `CHECKPOINT_MODELS=(\n    '${url(
        `${repositories[checkpoint.base]}/CHECKPOINT/${checkpoint.filename}`,
      )
      }'\n)`,
    );

    // Find all VAE models where base is checkpoint base
    const vaeModels = vaes
      .filter((vae) => vae.base.includes(checkpoint.base))
      .map((vae) => vae.filename);

    // Replace VAE_MODELS list
    pvs = pvs.replace(
      /VAE_MODELS=\(.*?\)/gms,
      `VAE_MODELS=(\n${vaeModels.map((x) =>
        `    '${url(`${repositories[checkpoint.base]}/VAE/${x}`)}'`
      ).join("\n")
      }\n)`,
    );

    // Find all Lora models where base is checkpoint base
    const loraModels = loras
      .filter((lora) => lora.base.includes(checkpoint.base))
      .map((lora) => lora.filename);

    // Replace LORA_MODELS with all Lora models
    pvs = pvs.replace(
      /LORA_MODELS=\(.*?\)/gms,
      `LORA_MODELS=(\n${loraModels.map((x) =>
        `    '${url(`${repositories[checkpoint.base]}/LORA/${x}`)}'`
      ).join("\n")
      }\n)`,
    );

    // Find all ControlNet models where base is checkpoint base
    const controlnetModels = controlnets
      .filter((controlnet) => controlnet.base.includes(checkpoint.base))
      .map((controlnet) => controlnet.filename);

    // Replace CONTROLNET_MODELS with all ControlNet models
    pvs = pvs.replace(
      /CONTROLNET_MODELS=\(.*?\)/gms,
      `CONTROLNET_MODELS=(\n${controlnetModels.map((x) =>
        `    '${url(`${repositories[checkpoint.base]}/CONTROLNET/${x}`)}'`
      ).join("\n")
      }\n)`,
    );

    // Find all Upscaler models where base is checkpoint base
    const upscalerModels = upscalers
      .filter((upscaler) => upscaler.base.includes(checkpoint.base))
      .map((upscaler) => upscaler.filename);

    // Replace ESRGAN_MODELS (upscalers) with all Upscaler models
    pvs = pvs.replace(
      /ESRGAN_MODELS=\(.*?\)/gms,
      `ESRGAN_MODELS=(\n${upscalerModels.map((x) =>
        `    '${url(`${repositories[checkpoint.base]}/ESRGAN/${x}`)}'`
      ).join("\n")
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

    if (ui.id === "forge" || ui.id === "comfy") {
      pvs = pvs.replace(
        /^function provisioning_start/m,
        `EMBEDDINGS_POSITIVE=(\n${embeddingsPositive.map((x) =>
          `    '${url(`${repositories[checkpoint.base]}/EMBEDDINGS/pos/${x}`)
          }'`
        ).join("\n")
        }\n)\n\nfunction provisioning_start`,
      );
      pvs = pvs.replace(
        /^function provisioning_start/m,
        `EMBEDDINGS_NEGATIVE=(\n${embeddingsNegative.map((x) =>
          `    '${url(`${repositories[checkpoint.base]}/EMBEDDINGS/neg/${x}`)
          }'`
        ).join("\n")
        }\n)\n\nfunction provisioning_start`,
      );
    }

    if (ui.id === "comfy" || ui.id === "forge") {
      pvs = pvs.replace(
        /provisioning_get_models \\/m,
        `provisioning_get_models \\\n        "\${WORKSPACE}/storage/stable_diffusion/${ui.id === "comfy" ? "models/" : ""
        }embeddings/positive" \\\n        "\${EMBEDDINGS_POSITIVE[@]}"\n    provisioning_get_models \\`,
      );
      pvs = pvs.replace(
        /provisioning_get_models \\/m,
        `provisioning_get_models \\\n        "\${WORKSPACE}/storage/stable_diffusion/${ui.id === "comfy" ? "models/" : ""
        }embeddings/negative" \\\n        "\${EMBEDDINGS_NEGATIVE[@]}"\n    provisioning_get_models \\`,
      );
    }

    // Remove multiple empty lines
    pvs = pvs.replace(/^\n{2,}/gm, "\n");

    await saveFile(`scripts/${ui.id}/${checkpoint.id}.sh`, pvs);

    const template = await createVastaiTemplate(
      `${ui.name}UI - ${checkpoint.name} ${checkpoint.version.toUpperCase()} - ${checkpoint.base.toUpperCase()}`,
      pvsUrl(ui, branch, checkpoint.id!),
      ui.image,
      ui.flags!
    );

    if (template.id) {
      console.log(`Template ${template.id} created successfully`);
      templates[checkpoint.id!] = {
        vastai: {
          [ui.id]: template.id
        }
      }
    }
  }
}

await saveFile("data/templates.json", JSON.stringify(templates, null, 2));

console.log("Done");
