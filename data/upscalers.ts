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
    homepage: "",
    base: ["sdxl", "pdxl"],
    comment: "",
  },
  {
    name: "8x NMKD Superscale 150000 G",
    filename: "8x_NMKD-Superscale_150000_G.pth",
    homepage: "",
    base: ["sdxl"],
    comment: "",
  },
  {
    name: "2xHFA2kOmniSR",
    filename: "2xHFA2kOmniSR.pth",
    homepage: "https://huggingface.co/Phips/2xHFA2kOmniSR",
    base: ["pdxl"],
    comment: "",
  },
];
