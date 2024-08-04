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

export const services: { [key: string]: { name: string; url: string; logo: string } } = {
  vastai: {
    name: 'Vast.ai',
    url: 'https://cloud.vast.ai/create/?ref_id=62878&template_id=',
    logo: 'images/vastai.svg',
  },
  runpodio: {
    name: 'Runpod.io',
    url: 'https://runpod.io/console/deploy?ref=gzvzzzv9&template=',
    logo: 'images/runpodio.svg',
  },
};

interface Checkpoint {
  name: string;
  homepage?: string;
  url: string;
  base: 'sdxl' | 'pdxl';
  vastaiTemplateId?: string;
  runpodioTemplateId?: string;
}

export const checkpoints: Checkpoint[] = [
  {
    name: 'ZavyChromaXL V9',
    homepage: 'https://civitai.com/models/119229?modelVersionId=641087',
    url: `${sdxlUrl}CHECKPOINT/zavychromaxl_v90.safetensors`,
    base: 'sdxl',
    vastaiTemplateId: 'de0f26247c1ccf592b624b233c6a7531',
    runpodioTemplateId: '1osvczwrdm',
  },
  {
    name: 'ZavyChromaXL V7',
    homepage: 'https://civitai.com/models/119229?modelVersionId=490254',
    url: `${sdxlUrl}CHECKPOINT/zavychromaxl_v70.safetensors`,
    base: 'sdxl',
    vastaiTemplateId: 'c664cf5f1a6b8b5ddc521baa1cdbf05e',
    runpodioTemplateId: '5mv7x9lk0p',
  },
  {
    name: 'WildCardX-XL',
    homepage: 'https://civitai.com/models/239561?modelVersionId=308455',
    url: `${sdxlUrl}CHECKPOINT/wildcardxXL_v4Rundiffusion.safetensors`,
    base: 'sdxl',
    vastaiTemplateId: 'c87381d3de507cfa88ccf05f8fd990c0',
    runpodioTemplateId: '9qr1azjcad',
  },
  {
    name: 'CHINOOK',
    homepage: 'https://civitai.com/models/400589?modelVersionId=495482',
    url: `${sdxlUrl}CHECKPOINT/CHINOOK_v10.safetensors`,
    base: 'sdxl',
    vastaiTemplateId: 'd06d11acd907913b24b6a345852d39e3',
    runpodioTemplateId: 'vu1meyunmp',
  },
  {
    name: "LEOSAM's HelloWorld XL",
    homepage: 'https://civitai.com/models/400589?modelVersionId=495482',
    url: `${sdxlUrl}CHECKPOINT/leosamsHelloworldXL_helloworldXL70.safetensors`,
    base: 'sdxl',
    vastaiTemplateId: '133b29d546034a67c65c497f76802cb0',
    runpodioTemplateId: '44x5bc9wrs',
  },
  {
    name: 'goddessOfRealism',
    homepage: 'https://civitai.com/models/212737?modelVersionId=573082',
    url: `${pdxlUrl}CHECKPOINT/goddessOfRealism_gorPONYV10.safetensors`,
    base: 'pdxl',
    vastaiTemplateId: '12ebd3285bd64e7d225dc6d70a5e05bb',
    runpodioTemplateId: 't43cv2upw0',
  },
  {
    name: 'Pony Diffusion V6 XL',
    homepage: 'https://civitai.com/models/257749?modelVersionId=290640',
    url: `${pdxlUrl}CHECKPOINT/ponyDiffusionV6XL_v6StartWithThisOne.safetensors`,
    base: 'pdxl',
    vastaiTemplateId: 'dedb7495b1bc8caea7bdbbb5ce002794',
    runpodioTemplateId: 'mgosofhzoc',
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
