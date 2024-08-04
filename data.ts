const ghToken = Bun.env.GH_TOKEN;
const hfToken = Bun.env.HF_TOKEN;
const pvsHash = Bun.env.PVS_HASH;

export const sdxlRepo = 'AddictiveFuture/sdxl-1-0-models-backup';
export const pdxlRepo = 'AddictiveFuture/sdxl-pony-models-backup';

export const sdxlUrl = `https://huggingface.co/datasets/${sdxlRepo}/resolve/main/`;
export const pdxlUrl = `https://huggingface.co/datasets/${pdxlRepo}/resolve/main/`;

const fetchRepoContents = async (repo: string) =>
  await fetch(`https://huggingface.co/api/datasets/${repo}?full=true`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${hfToken}` },
  });

const sdxlRepoContents = await fetchRepoContents(sdxlRepo);
const pdxlRepoContents = await fetchRepoContents(pdxlRepo);

const sdxlJson = await sdxlRepoContents.json();
const pdxlJson = await pdxlRepoContents.json();

const sdxlFiles = sdxlJson.siblings.map((x: { rfilename: string }) => x.rfilename);
const pdxlFiles = pdxlJson.siblings.map((x: { rfilename: string }) => x.rfilename);

export const services: { name: string; ref: string }[] = [
  {
    name: 'Runpod.io',
    ref: 'https://runpod.io?ref=gzvzzzv9',
  },
  {
    name: 'Vast.ai',
    ref: 'https://cloud.vast.ai/?ref_id=62878',
  },
];

interface Checkpoint {
  name: string;
  homepage: string;
  url: string;
  base: 'sdxl' | 'pdxl';
}

export const checkpoints: Checkpoint[] = [
  {
    name: 'ZavyChromaXL V7',
    homepage: 'https://civitai.com/models/119229?modelVersionId=490254',
    url: `${sdxlUrl}CHECKPOINT/zavychromaxl_v70.safetensors`,
    base: 'sdxl',
  },
  {
    name: 'ZavyChromaXL V9',
    homepage: 'https://civitai.com/models/119229?modelVersionId=641087',
    url: `${sdxlUrl}CHECKPOINT/zavychromaxl_v90.safetensors`,
    base: 'sdxl',
  },
  {
    name: 'WildCardX-XL',
    homepage: 'https://civitai.com/models/239561?modelVersionId=308455',
    url: `${sdxlUrl}CHECKPOINT/wildcardxXL_v4Rundiffusion.safetensors`,
    base: 'sdxl',
  },
  {
    name: '_CHINOOK_',
    homepage: 'https://civitai.com/models/400589?modelVersionId=495482',
    url: `${sdxlUrl}CHECKPOINT/CHINOOK_v10.safetensors`,
    base: 'sdxl',
  },
  {
    name: 'goddessOfRealism',
    homepage: '',
    url: `${pdxlUrl}CHECKPOINT/goddessOfRealism_gorPONYV10.safetensors`,
    base: 'pdxl',
  },
  {
    name: 'Pony Diffusion V6 XL',
    homepage: '',
    url: `${pdxlUrl}CHECKPOINT/ponyDiffusionV6XL_v6StartWithThisOne.safetensors`,
    base: 'pdxl',
  },
];

// interface Lora {
//   name: string;
//   homepage: string;
//   url: string;
//   triggers: string[];
// }

interface Loras {
  sdxl: string[];
  pdxl: string[];
}

export const loras: Loras = {
  sdxl: sdxlFiles.filter((x: string) => x.startsWith('LORA/')).map((x: string) => `${sdxlUrl}${x}`),
  pdxl: pdxlFiles.filter((x: string) => x.startsWith('LORA/')).map((x: string) => `${pdxlUrl}${x}`),
};

interface Embeddings {
  sdxl: {
    pos: string[];
    neg: string[];
  };
  pdxl: {
    pos: string[];
    neg: string[];
  };
}

export const embeddings: Embeddings = {
  sdxl: {
    pos: sdxlFiles.filter((x: string) => x.startsWith('EMBEDDINGS/pos')).map((x: string) => `${sdxlUrl}${x}`),
    neg: sdxlFiles.filter((x: string) => x.startsWith('EMBEDDINGS/neg')).map((x: string) => `${sdxlUrl}${x}`),
  },
  pdxl: {
    pos: pdxlFiles.filter((x: string) => x.startsWith('EMBEDDINGS/pos')).map((x: string) => `${pdxlUrl}${x}`),
    neg: pdxlFiles.filter((x: string) => x.startsWith('EMBEDDINGS/neg')).map((x: string) => `${pdxlUrl}${x}`),
  },
};

interface Vaes {
  sdxl: { name: string; url: string }[];
  pdxl: { name: string; url: string }[];
}

export const vaes: Vaes = {
  sdxl: sdxlFiles.filter((x: string) => x.startsWith('VAE/')).map((x: string) => `${sdxlUrl}${x}`),
  pdxl: pdxlFiles.filter((x: string) => x.startsWith('VAE/')).map((x: string) => `${pdxlUrl}${x}`),
};

interface Upscalers {
  sdxl: string[];
  pdxl: string[];
}

export const upscalers: Upscalers = {
  sdxl: sdxlFiles.filter((x: string) => x.startsWith('ESRGAN/')).map((x: string) => `${sdxlUrl}${x}`),
  pdxl: pdxlFiles.filter((x: string) => x.startsWith('ESRGAN/')).map((x: string) => `${pdxlUrl}${x}`),
};

interface Extensions {
  universal: string[];
  sdxl: string[];
  pdxl: string[];
}
export const extensions: Extensions = {
  universal: [
    'https://github.com/Mikubill/sd-webui-controlnet',
    'https://github.com/adieyal/sd-dynamic-prompts',
    'https://github.com/hako-mikan/sd-webui-regional-prompter',
    'https://github.com/Bing-su/adetailer',
  ],
  sdxl: ['https://github.com/pharmapsychotic/clip-interrogator'],
  pdxl: ['https://github.com/picobyte/stable-diffusion-webui-wd14-tagger'],
};
