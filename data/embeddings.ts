export interface Embedding {
  filename: string;
  homepage: string;
  base: string[];
  type: "positive" | "negative";
}

export const embeddings: Embedding[] = [
  {
    filename: "SK_ANALOGFILM.safetensors",
    homepage: "https://civitai.com/models/148131?modelVersionId=167631",
    base: ["sdxl"],
    type: "positive",
  },
  {
    filename: "SK_CINEMATIC.safetensors",
    homepage: "https://civitai.com/models/148131?modelVersionId=167633",
    base: ["sdxl"],
    type: "positive",
  },
  {
    filename: "DeepNegative_xl_v1.safetensors",
    homepage: "https://civitai.com/models/407448/deep-negative-xl",
    base: ["sdxl"],
    type: "negative",
  },
  {
    filename: "NDXL.safetensors",
    homepage: "https://civitai.com/models/454470?modelVersionId=506019",
    base: ["sdxl"],
    type: "negative",
  },
  {
    filename: "NEG-fixl-2.safetensors",
    homepage: "https://civitai.com/models/385105?modelVersionId=429806",
    base: ["sdxl"],
    type: "negative",
  },
  {
    filename: "ac_neg1.safetensors",
    homepage: "https://civitai.com/models/148131?modelVersionId=166373",
    base: ["sdxl"],
    type: "negative",
  },
  {
    filename: "ac_neg2.safetensors",
    homepage: "https://civitai.com/models/148131?modelVersionId=166375",
    base: ["sdxl"],
    type: "negative",
  },
  {
    filename: "ziprealism_neg.safetensors",
    homepage: "https://civitai.com/models/148131?modelVersionId=165259",
    base: ["sdxl"],
    type: "negative",
  },
  {
    filename: "EZNegPONYXL-neg.safetensors",
    homepage: "https://civitai.com/models/587651?modelVersionId=656021",
    base: ["pdxl"],
    type: "negative",
  },
  {
    filename: "VDiffPDXL_Neg-neg.safetensors",
    homepage: "https://civitai.com/models/389486?modelVersionId=515544",
    base: ["pdxl"],
    type: "negative",
  },
  {
    filename: "zPDXLpg-neg.pt",
    homepage: "https://civitai.com/models/332646?modelVersionId=380285",
    base: ["pdxl"],
    type: "negative",
  },
  {
    filename: "zPDXLxxx-neg.pt",
    homepage: "https://civitai.com/models/332646?modelVersionId=380277",
    base: ["pdxl"],
    type: "negative",
  },
  {
    filename: "zPDXL3.safetensors",
    homepage: "https://civitai.com/models/332646?modelVersionId=720175",
    base: ["pdxl"],
    type: "positive",
  },
  {
    filename: "zPDXLpg.pt",
    homepage: "https://civitai.com/models/332646?modelVersionId=380285",
    base: ["pdxl"],
    type: "positive",
  },
  {
    filename: "zPDXLxxx.pt",
    homepage: "https://civitai.com/models/332646?modelVersionId=380277",
    base: ["pdxl"],
    type: "positive",
  },
  {
    filename: "GlamorShots_PDXL.safetensors",
    homepage: "https://civitai.com/models/463256?modelVersionId=516254",
    base: ["pdxl"],
    type: "positive",
  },
];
