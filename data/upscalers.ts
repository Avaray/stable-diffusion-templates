export interface Upscaler {
  name: string;
  filename: string;
  homepage: string;
  base: string[];
  comment?: string;
}

export const upscalers: Upscaler[] = [
  {
    name: "4x UltraSharp",
    filename: "4x-UltraSharp.pth",
    homepage: "https://openmodeldb.info/models/4x-UltraSharp",
    base: ["sdxl", "pdxl"],
    comment: "For illustrations, manga, and anime",
  },
  {
    name: "8x NMKD Superscale 150000 G",
    filename: "8x_NMKD-Superscale_150000_G.pth",
    homepage: "https://openmodeldb.info/models/4x-NMKD-Superscale",
    base: ["sdxl"],
    comment: "Good for realistic photography",
  },
  {
    name: "4xNomosWebPhoto RealPLKSR",
    filename: "4xNomosWebPhoto_RealPLKSR.pth",
    homepage: "https://openmodeldb.info/models/4x-NomosWebPhoto-RealPLKSR",
    base: ["sdxl"],
    comment: "Good for realistic photography",
  },
  {
    name: "4x AnimeSharp Lite",
    filename: "4x-AnimeSharp-lite.pth",
    homepage: "https://openmodeldb.info/models/4x-AnimeSharp-lite",
    base: ["pdxl"],
    comment: "For illustrations, manga, and anime",
  },
  {
    name: "4x animerd",
    filename: "4x-animerd-v1.pth",
    homepage: "https://openmodeldb.info/models/4x-animerd-v1",
    base: ["pdxl"],
    comment: "For illustrations, manga, and anime",
  },
  {
    name: "RealESRGAN x4Plus Anime 6B",
    filename: "RealESRGAN_x4plus_anime_6B.pth",
    homepage: "https://openmodeldb.info/models/4x-realesrgan-x4plus-anime-6b",
    base: ["pdxl"],
    comment: "For illustrations, manga, and anime",
  },
];
