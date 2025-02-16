export interface Extension {
  name: string;
  uis: string[];
  base: string[];
  url: string;
}

// https://github.com/AUTOMATIC1111/stable-diffusion-webui-extensions/blob/extensions/index.json

export const extensions: Extension[] = [
  {
    name: "Dynamic Prompts",
    uis: ["forge"],
    base: ["sdxl", "pdxl"],
    url: "https://github.com/adieyal/sd-dynamic-prompts",
  },
  {
    name: "ADetailer",
    uis: ["forge"],
    base: ["sdxl", "pdxl"],
    url: "https://github.com/Bing-su/adetailer",
  },
  {
    name: "LoRA Keywords Finder",
    uis: ["forge"],
    base: ["sdxl", "pdxl"],
    url: "https://github.com/Avaray/lora-keywords-finder",
  },
  {
    name: "WD14 Tagger",
    uis: ["forge"],
    base: ["pdxl"],
    url: "https://github.com/picobyte/stable-diffusion-webui-wd14-tagger",
  },
];
