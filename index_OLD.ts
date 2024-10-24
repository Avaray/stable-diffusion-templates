// First we need Provisioning script. Without it we can't do anything.
let pvs = '';
try {
  pvs = await (
    await fetch(
      'https://raw.githubusercontent.com/ai-dock/stable-diffusion-webui-forge/main/config/provisioning/default.sh',
    )
  ).text();
} catch (error) {
  console.error(`Error fetching provisioning script: ${error}`);
  process.exit(1);
}

const knownPvsTuples = JSON.parse(Bun.env.PVS_TUPLES || '[]');
const knownPvsFunctions = JSON.parse(Bun.env.PVS_FUNCTIONS || '[]');
const pvsFunctionNameRegex = /(?<=function\s)\w+/gm;
const pvsTupleNameRegex = /^\w+(?==\()/gm;
const allPvsFunctions = pvs.match(pvsFunctionNameRegex) || [];
const allPvsTuples = pvs.match(pvsTupleNameRegex) || [];
const newPvsFunctions = allPvsFunctions.filter((x) => !knownPvsFunctions.includes(x));
const newPvsTuples = allPvsTuples.filter((x) => !knownPvsTuples.includes(x));

const functionCode = (x: string) => {
  const regex = new RegExp(`^function\\s${x}\\(\\)[\\W\\w]*?[\\s\\n]\}(?=[\\s\\n])`, 'm');
  const match = pvs.match(regex);
  return match ? `\`\`\`python\n${match[0]}\n\`\`\`` : '';
};

const tupleCode = (x: string) => {
  const regex = new RegExp(`^${x}=\\([\\W\\w]*?\\)`, 'm');
  const match = pvs.match(regex);
  return match ? `\`\`\`python\n${match[0]}\n\`\`\`` : '';
};

const title =
  (newPvsFunctions.length || newPvsTuples.length) &&
  `Found ${newPvsFunctions.length ? `${newPvsFunctions.length} new functions` : ''} ${
    newPvsFunctions.length && newPvsTuples.length ? 'and' : ''
  } ${newPvsTuples.length ? `${newPvsTuples.length} new tuples` : ''} in provisioning script.`;

let description = '';

if (title && newPvsFunctions.length) {
  description += `## New functions\n\n${newPvsFunctions.map((x) => `${functionCode(x)}\n`).join('\n')}\n`;
}

if (title && newPvsTuples.length) {
  description += `## New tuples\n\n${newPvsTuples.map((x) => `${tupleCode(x)}\n`).join('\n')}`;
}

// TODO: Here I will output the title and description to the console.
// Workflow will use this output to create a new issue in the repository.

const knownTuplesToClean = [
  'CHECKPOINT_MODELS',
  'EXTENSIONS',
  'LORA_MODELS',
  'VAE_MODELS',
  'ESRGAN_MODELS',
  'CONTROLNET_MODELS',
];

const unknownTuplesToClean = pvs.match(/^[\w]+=\([\W\w]*?\)/gm);

if (unknownTuplesToClean) {
  for (const tuple of unknownTuplesToClean) {
    const key = tuple.split('=')[0];
    if (knownTuplesToClean.includes(key)) {
      pvs = pvs.replace(tuple, `${key}=()`);
    } else {
      const values = tuple
        .split('=')[1]
        .replace(/[\(\)]/g, '')
        .split('\n')
        .map((x) => x.trim())
        .filter((x) => x && !x.startsWith('#'));
      pvs = pvs.replace(
        tuple,
        `${key}=(${values.length ? `\n    ${values.join('\n    ')}\n` : ''})`,
      );
      // console.log({ key, values });
    }
  }
}

// Remove everything between shebang and first variable assignment
pvs = pvs.replace(/^#\s[\w\W]*?(?=\w+=)/m, '\n');
// Remove comments
pvs = pvs.replace(/^\s*?#+\s[\w\W]*?$/gm, '\n');
// Set DISK_GB_REQUIRED to 40 (default is 30)
pvs = pvs.replace(/^DISK_GB_REQUIRED.*$/gm, 'DISK_GB_REQUIRED=40');
// Add EMBEDDINGS=() before provisioning_start function
pvs = pvs.replace(/^function provisioning_start/gm, 'EMBEDDINGS=()\n\nfunction provisioning_start');
// Remove multiple empty lines
pvs = pvs.replace(/^\n{2,}/gm, '\n');

import { checkpoints, loras, embeddings, vaes, upscalers, extensions } from './data';

const scripts = [] as string[];

for (const ckpt of checkpoints) {
  let pvsTemp = pvs;

  pvsTemp = pvsTemp.replace(
    /^CHECKPOINT_MODELS=\(\)/gm,
    `CHECKPOINT_MODELS=(\n    '${ckpt.url}'\n)`,
  );

  pvsTemp = pvsTemp.replace(
    /^LORA_MODELS=\(\)/gm,
    `LORA_MODELS=(\n    ${loras[ckpt.base].map((x) => `'${x}'`).join('\n    ')}\n)`,
  );

  pvsTemp = pvsTemp.replace(
    /^VAE_MODELS=\(\)/gm,
    `VAE_MODELS=(\n    ${vaes[ckpt.base].map((x) => `'${x}'`).join('\n    ')}\n)`,
  );

  pvsTemp = pvsTemp.replace(
    /^ESRGAN_MODELS=\(\)/gm,
    `ESRGAN_MODELS=(\n    ${upscalers[ckpt.base].map((x) => `'${x}'`).join('\n    ')}\n)`,
  );

  const exts = [...extensions.universal, ...extensions[ckpt.base]];

  pvsTemp = pvsTemp.replace(
    /^EXTENSIONS=\(\)/gm,
    `EXTENSIONS=(\n    ${exts.map((x) => `'${x}'`).join('\n    ')}\n)`,
  );

  const filename = ckpt.url.split('/').pop()?.replace(/\.\w+/, '.sh').toLowerCase() ?? '';

  filename && scripts.push(filename);

  await Bun.write(`scripts/${filename}`, pvsTemp);
}

import { readdir, unlink } from 'node:fs/promises';

const allScripts = await readdir('scripts');

for (const script of allScripts) {
  if (!scripts.includes(script)) {
    console.log(`Removing old script: ${script}`);
    await unlink(`scripts/${script}`);
  }
}
