export interface VAE {
  name: string;
  filename: string;
  homepage: string;
  base: string[];
}

export const vaes: VAE[] = [
  {
    name: 'SDXL Default',
    filename: 'sdxl_vae.safetensors',
    homepage: 'https://huggingface.co/stabilityai/sdxl-vae',
    base: ['sdxl', 'pdxl'],
  },
];
