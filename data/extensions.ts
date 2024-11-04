export interface Extension {
  name: string;
  uis: string[];
  base: string[];
  url: string;
}

export const extensions: Extension[] = [
  {
    name: 'Dynamic Prompts',
    uis: ['forge'],
    base: ['sdxl', 'pdxl'],
    url: 'https://github.com/adieyal/sd-dynamic-prompts',
  },
  {
    name: 'ADetailer',
    uis: ['forge'],
    base: ['sdxl', 'pdxl'],
    url: 'https://github.com/Bing-su/adetailer',
  },
  {
    name: 'LoRA Keywords Finder',
    uis: ['forge'],
    base: ['sdxl', 'pdxl'],
    url: 'https://github.com/Avaray/lora-keywords-finder',
  },
  {
    name: 'Clip Interrogator',
    uis: ['forge'],
    base: ['sdxl'],
    url: 'https://github.com/pharmapsychotic/clip-interrogator',
  },
  {
    name: 'WD14 Tagger',
    uis: ['forge'],
    base: ['pdxl'],
    url: 'https://github.com/picobyte/stable-diffusion-webui-wd14-tagger',
  },
];
