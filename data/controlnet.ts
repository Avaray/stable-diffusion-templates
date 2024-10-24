export interface Controlnet {
  name: string;
  filename: string;
  homepage: string;
  base: string[];
}

export const controlnet = [
  {
    name: 'Union',
    filename: 'xinsir_union.safetensors',
    homepage: 'https://huggingface.co/xinsir/controlnet-union-sdxl-1.0',
    base: ['sdxl', 'pdxl'],
  },
];
