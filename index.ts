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

pvs = pvs.replace(/^#\s[\w\W]*?(?=DISK)/m, '\n');
pvs = pvs.replace(/^\s*?#+\s[\w\W]*?$/gm, '\n');
pvs = pvs.replace(/^DISK_GB_REQUIRED.*$/gm, 'DISK_GB_REQUIRED=40');
pvs = pvs.replace(/^PIP_PACKAGES=\(\W*\)/gm, 'PIP_PACKAGES=()');

for (const x of [
  'EXTENSIONS',
  'CHECKPOINT_MODELS',
  'LORA_MODELS',
  'VAE_MODELS',
  'ESRGAN_MODELS',
  'CONTROLNET_MODELS',
]) {
  pvs = pvs.replace(new RegExp(`^${x}=\\([\\W\\w]*?\\)`, 'gm'), `${x}=()`);
}

pvs = pvs.replace(/^function provisioning_start/gm, 'EMBEDDINGS=()\n\nfunction provisioning_start');

pvs = pvs.replace(/^\n{2,}/gm, '\n');

import { checkpoints, loras, embeddings, vaes, upscalers, extensions } from './data';

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

  const filename = ckpt.url.split('/').pop()?.replace(/\.\w+/, '.sh').toLowerCase();
  await Bun.write(`scripts/${filename}`, pvsTemp);
}
