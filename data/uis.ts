export interface UI {
  id: string;
  name: string;
  image: string;
  repository: string;
  pvs: string;
  supports: string[];
  flags?: string;
};

const defaultPvsUrl = (repository: string) => {
  const repo = repository.split('/').slice(-2).join('/');
  return `https://raw.githubusercontent.com/${repo}/refs/heads/main/config/provisioning/default.sh`;
};

const userInterfaces: UI[] = [
  {
    id: 'forge',
    name: 'Forge',
    image: 'ghcr.io/ai-dock/stable-diffusion-webui-forge',
    repository: 'https://github.com/ai-dock/stable-diffusion-webui-forge',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
    flags: '',
  },
  {
    id: 'comfy',
    name: 'Comfy',
    image: 'ghcr.io/ai-dock/comfyui',
    repository: 'https://github.com/ai-dock/comfyui',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
    flags: '',
  },
  {
    id: 'invoke',
    name: 'Invoke',
    image: 'ghcr.io/ai-dock/invokeai',
    repository: 'https://github.com/ai-dock/invokeai',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
    flags: '',
  },
  {
    id: 'fooocus',
    name: 'Fooocus',
    image: 'ghcr.io/ai-dock/fooocus',
    repository: 'https://github.com/ai-dock/fooocus',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
    flags: '',
  },
];

async function fetchPvsData(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(error);
    return '';
  }
}

async function getUisWithPvs(): Promise<UI[]> {
  const uisWithPvs = await Promise.all(
    userInterfaces.map(async (ui) => {
      const pvsUrl = defaultPvsUrl(ui.repository);
      const pvs = await fetchPvsData(pvsUrl);
      return { ...ui, pvs };
    }),
  );
  return uisWithPvs;
}

export const uis = await getUisWithPvs();
