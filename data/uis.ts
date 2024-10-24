export interface UI {
  id: string;
  name: string;
  repository: string;
}

export const uis: UI[] = [
  {
    id: 'forge',
    name: 'Forge',
    repository: 'https://github.com/ai-dock/stable-diffusion-webui-forge',
  },
  {
    id: 'comfy',
    name: 'Comfy',
    repository: 'https://github.com/ai-dock/comfyui',
  },
  {
    id: 'invoke',
    name: 'Invoke',
    repository: 'https://github.com/ai-dock/invokeai',
  },
  {
    id: 'fooocus',
    name: 'Fooocus',
    repository: 'https://github.com/ai-dock/fooocus',
  },
];
