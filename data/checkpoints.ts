import { normalizeFilename } from "../utils";

export interface Checkpoint {
  id?: string;
  name: string;
  filename: string;
  homepage: string;
  base: string;
  version: string;
  rating: string;
  comment: string;
}

export const ckpts: Checkpoint[] = [
  {
    name: "RealVis",
    filename: "realvisxlV50_v50Bakedvae.safetensors",
    homepage: "https://civitai.com/models/139562?modelVersionId=789646",
    base: "sdxl",
    version: "5",
    rating: "a",
    comment: "",
  },
  {
    name: "RealVis",
    filename: "realvisxlV40_v40Bakedvae.safetensors",
    homepage: "https://civitai.com/models/139562?modelVersionId=344487",
    base: "sdxl",
    version: "4",
    rating: "a",
    comment: "",
  },
  {
    name: "WildCardX",
    filename: "wildcardxXL_v4Rundiffusion.safetensors",
    homepage: "https://civitai.com/models/239561?modelVersionId=308455",
    base: "sdxl",
    version: "4",
    rating: "a",
    comment: "My favorite SDXL checkpoint for realistic photography.",
  },
  {
    name: "AlbedoBase",
    filename: "albedobaseXL_v3Mini.safetensors",
    homepage: "https://civitai.com/models/140737?modelVersionId=892880",
    base: "sdxl",
    version: "3-mini",
    rating: "a",
    comment: "",
  },
  {
    name: "AlbedoBase",
    filename: "albedobaseXL_v31Large.safetensors",
    homepage:
      "https://civitai.com/models/140737/albedobase-xl?modelVersionId=1041855",
    base: "sdxl",
    version: "3.1-large",
    rating: "",
    comment: "",
  },
  {
    name: "ZavyChroma",
    filename: "zavychromaxl_v100.safetensors",
    homepage: "https://civitai.com/models/119229?modelVersionId=916744",
    base: "sdxl",
    version: "10",
    rating: "",
    comment: "",
  },
  {
    name: "ZavyChroma",
    filename: "zavychromaxl_v90.safetensors",
    homepage: "https://civitai.com/models/119229?modelVersionId=641087",
    base: "sdxl",
    version: "9",
    rating: "a",
    comment:
      "Awesome checkpoint for general use. Great for photography. I think it's less flexible than vversion 7, but it produces higher quality results.",
  },
  {
    name: "ZavyChroma",
    filename: "zavychromaxl_v70.safetensors",
    homepage: "https://civitai.com/models/119229?modelVersionId=490254",
    base: "sdxl",
    version: "7",
    rating: "b",
    comment: "",
  },
  {
    name: "CHINOOK",
    filename: "CHINOOK_v10.safetensors",
    homepage: "https://civitai.com/models/400589?modelVersionId=495482",
    base: "sdxl",
    version: "1",
    rating: "a",
    comment:
      "One of my favorites when it comes to realism and artistic photography.",
  },
  {
    name: "epiCRealism",
    filename: "epicrealismXL_vxiAbeast.safetensors",
    homepage: "https://civitai.com/models/277058?modelVersionId=1156226",
    base: "sdxl",
    version: "",
    rating: "",
    comment: "",
  },
  {
    name: "epiCRealism",
    filename: "epicrealismXL_v10Kiss2.safetensors",
    homepage: "https://civitai.com/models/277058?modelVersionId=1013306",
    base: "sdxl",
    version: "10-KiSS2",
    rating: "",
    comment: "",
  },
  {
    name: "epiCRealism",
    filename: "epicrealismXL_v9Unflux.safetensors",
    homepage: "https://civitai.com/models/277058?modelVersionId=931522",
    base: "sdxl",
    version: "9-UnFlux",
    rating: "",
    comment: "",
  },
  {
    name: "epiCRealism",
    filename: "epicrealismXL_v8Kiss.safetensors",
    homepage: "https://civitai.com/models/277058?modelVersionId=646523",
    base: "sdxl",
    version: "8",
    rating: "b",
    comment: "Solid checkpoint for Realism. Good for general use.",
  },
  {
    name: "LEOSAM's HelloWorld",
    filename: "leosamsHelloworldXL_helloworldXL70.safetensors",
    homepage: "https://civitai.com/models/400589?modelVersionId=495482",
    base: "sdxl",
    version: "7",
    rating: "b",
    comment: "",
  },
  {
    name: "Juggernaut",
    filename: "juggernautXL_juggXIByRundiffusion.safetensors",
    homepage: "https://civitai.com/models/133005?modelVersionId=782002",
    base: "sdxl",
    version: "11",
    rating: "",
    comment: "",
  },
  {
    name: "Juggernaut",
    filename: "Juggernaut_X_RunDiffusion.safetensors",
    homepage: "https://civitai.com/models/133005?modelVersionId=456194",
    base: "sdxl",
    version: "10",
    rating: "b",
    comment: "Solid checkpoint. Good for general use.",
  },
  {
    name: "DreamShaper",
    filename: "dreamshaperXL_alpha2Xl10.safetensors",
    homepage: "https://civitai.com/models/112902?modelVersionId=126688",
    base: "sdxl",
    version: "2a",
    rating: "b",
    comment: "Solid checkpoint. Good for general use.",
  },
  {
    name: "Copax TimeLess",
    filename: "copaxTimelessxlSDXL1_v12.safetensors",
    homepage: "https://civitai.com/models/118111?modelVersionId=445348",
    base: "sdxl",
    version: "12",
    rating: "",
    comment: "",
  },
  {
    name: "Halcyon",
    filename: "halcyonSDXL_v18.safetensors",
    homepage: "https://civitai.com/models/299933?modelVersionId=655762",
    base: "sdxl",
    version: "1.8",
    rating: "b",
    comment:
      "Generated faces are too shiny in my opinion. This checkpoint is not good for photorealism. There are much better checkpoints in this list.",
  },
  {
    name: "GODDESS of Realism",
    filename: "goddessOfRealism_gorPONYV10.safetensors",
    homepage: "https://civitai.com/models/212737?modelVersionId=573082",
    base: "pdxl",
    version: "1",
    rating: "a",
    comment:
      "The best realistic checkpoint based on Pony Diffusion. Stable. Very flexible.",
  },
  {
    name: "Pony Diffusion",
    filename: "ponyDiffusionV6XL_v6StartWithThisOne.safetensors",
    homepage: "https://civitai.com/models/257749?modelVersionId=290640",
    base: "pdxl",
    version: "6",
    rating: "a",
    comment:
      "Checkpoint for Anime. Trained for NSFW. Very flexible. You can play with many styles.",
  },
  {
    name: "AutismMix",
    filename: "autismmixSDXL_autismmixPony.safetensors",
    homepage: "https://civitai.com/models/288584?modelVersionId=324619",
    base: "pdxl",
    version: "1",
    rating: "a",
    comment:
      "NSFW checkpoint for Anime. Good alternative for Pony Diffusion V6.",
  },
  {
    name: "AlchemistMix",
    filename: "alchemistmix_v10.safetensors",
    homepage:
      "https://civitai.com/models/916289/alchemistmixrealhentaiponyv1?modelVersionId=1025594",
    base: "pdxl",
    version: "1",
    rating: "",
    comment: "",
  },
];

export const checkpoints = ckpts.map((ckpt) => ({
  ...ckpt,
  id: normalizeFilename(ckpt.filename),
}));
