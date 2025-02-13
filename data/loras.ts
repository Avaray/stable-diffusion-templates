export interface Lora {
  name: string;
  filename: string;
  homepage: string;
  base: string[];
  triggerwords: string[];
  comment: string;
}

export const loras = [
  {
    name: "Looking at Viewer",
    filename: "looking_at_viewer.safetensors",
    homepage: "https://civitai.com/models/229962/looking-at-viewer-sliders-ntcaixyz",
    base: ["sdxl"],
    triggerwords: ["looking at viewer"],
    comment: "",
  },
  {
    name: "Weight Slider",
    filename: "weight_slider-sdxl.safetensors",
    homepage: "https://civitai.com/models/443279?modelVersionId=493678",
    base: ["sdxl"],
    triggerwords: ["weight"],
    comment: "",
  },
  {
    "name": "Maybe Better Pose Lora XL",
    "hinaMaybeBetterPoseXL_v5-NoobAI.safetensors",
    homepage: "https://civitai.com/models/339001?modelVersionId=1110783",
    base: ["sdxl"],
    triggerwords: [],
    comment: "Gives some randomness to the poses",
  }
  {
    name: "Milf Style V2",
    filename: "MS_Milf_Style_V2_Pony.safetensors",
    homepage: "https://civitai.com/models/681666/milf-style-for-pony",
    base: ["sdxl", "pdxl"],
    triggerWords: ["milf"],
    comment: "",
  },
  {
    name: "Milf Style V3",
    filename: "MS_Milf_Style_V3_Pony.safetensors",
    homepage: "https://civitai.com/models/681666?modelVersionId=999073",
    base: ["pdxl"],
    triggerWords: ["milf"],
    comment: "",
  },
  {
    name: "Age Slider",
    filename: "age_slider-sdxl.safetensors",
    homepage: "https://civitai.com/models/443279?modelVersionId=493670",
    base: ["sdxl"],
    triggerWords: [],
    comment: "",
  },
  {
    name: "Maybe Better Pose",
    filename: "hinaMaybeBetterPoseXL_v5-NoobAI.safetensors",
    homepage: "https://civitai.com/models/339001?modelVersionId=1110783",
    base: ["sdxl", "pdxl"],
    triggerWords: [],
    comment: "",
  },
  {
    name: "Cleavage Slider",
    filename: "Cleavage_Slider_alpha1.0_rank4_noxattn_last.safetensors",
    homepage: "https://civitai.com/models/487321?modelVersionId=541905",
    base: ["pdxl"],
    triggerwords: [],
    comment: "",
  },
  {
    name: "Tight Slider",
    filename: "Thigh_Size_Slider_V2_alpha1.0_rank4_noxattn_last.safetensors",
    homepage: "https://civitai.com/models/481421?modelVersionId=625365",
    base: ["pdxl"],
    triggerwords: [],
    comment: "",
  },
  {
    name: "Envy Pony Pretty Eyes",
    filename: "EnvyPonyPrettyEyes01.safetensors",
    homepage: "https://civitai.com/models/393101/envy-pony-pretty-eyes-01-pretty-anime-eyes",
    base: ["pdxl"],
    triggerwords: [],
    comment: "",
  },
  {
    name: "GLSHS Style v2.4",
    filename: "GLSHS_Style_V2_4.safetensors",
    homepage: "https://civitai.com/models/550871?modelVersionId=669776",
    base: ["pdxl"],
    triggerwords: ["GLSHS", "partially illuminated"],
    comment: "",
  },
  {
    name: "GLSHS Style v3N",
    filename: "GLSHS_Style_V3_N.safetensors",
    homepage: "https://civitai.com/models/550871?modelVersionId=950053",
    base: ["pdxl"],
    triggerwords: ["GLSHS"],
    comment: "",
  },
  {
    name: "Retro Neon Style",
    filename: "retro-neon-style-pony.safetensors",
    homepage: "https://civitai.com/models/569937?modelVersionId=635256",
    base: ["pdxl"],
    triggerwords: ["retro_neon"],
    comment: "",
  },
  {
    name: "Retro 60s Style (Dan Decarlo)",
    filename: "Retro_60s_Decarlo_V1_PDXL.safetensors",
    homepage: "https://civitai.com/models/553267?modelVersionId=615701",
    base: ["pdxl"],
    triggerwords: ["decarloxl", "retro colors", "60s"],
    comment: "",
  },
  {
    name: "Flat Colour Anime",
    filename: "flat_colour_anime_style_v2.1_pony.safetensors",
    homepage: "https://civitai.com/models/180891?modelVersionId=848421",
    base: ["pdxl"],
    triggerwords: ["fca_style"],
    comment: "",
  },
  {
    name: "Mangamaster [Artist Style]",
    filename: "Mangamaster_Artist_Style.safetensors",
    homepage: "https://civitai.com/models/725922?modelVersionId=811736",
    base: ["pdxl"],
    triggerwords: ["Manmast"],
    comment: "",
  },
  {
    name: "Mangamaster V2 [Artist Style]",
    filename: "Mangamaster_Artist_Style_v2.safetensors",
    homepage: "https://civitai.com/models/725922?modelVersionId=1111421",
    base: ["pdxl"],
    triggerwords: ["mangamaster"],
    comment: "",
  },
];
