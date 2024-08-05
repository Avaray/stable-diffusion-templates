// First we need Provisioning script. Without it we can't do anything.
let pvs = '';
try {
  pvs = await (
    await fetch('https://raw.githubusercontent.com/ai-dock/stable-diffusion-webui/main/config/provisioning/default.sh')
  ).text();
} catch (error) {
  console.error(`Error fetching provisioning script: ${error}`);
  process.exit(1);
}

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
      pvs = pvs.replace(tuple, `${key}=(${values.length ? `\n    ${values.join('\n    ')}\n` : ''})`);
      console.log({ key, values });
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

  pvsTemp = pvsTemp.replace(/^CHECKPOINT_MODELS=\(\)/gm, `CHECKPOINT_MODELS=(\n    '${ckpt.url}'\n)`);

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

  pvsTemp = pvsTemp.replace(/^EXTENSIONS=\(\)/gm, `EXTENSIONS=(\n    ${exts.map((x) => `'${x}'`).join('\n    ')}\n)`);

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
