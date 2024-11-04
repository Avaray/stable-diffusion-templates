export interface UI {
  id: string;
  name: string;
  repository: string;
  pvs: string;
  supports: string[];
};

const defaultPvsUrl = (repository: string) => {
  const repo = repository.split('/').slice(-2).join('/');
  return `https://raw.githubusercontent.com/${repo}/refs/heads/main/config/provisioning/default.sh`;
};

const userInterfaces: UI[] = [
  {
    id: 'forge',
    name: 'Forge',
    repository: 'https://github.com/ai-dock/stable-diffusion-webui-forge',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
  },
  {
    id: 'comfy',
    name: 'Comfy',
    repository: 'https://github.com/ai-dock/comfyui',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
  },
  {
    id: 'invoke',
    name: 'Invoke',
    repository: 'https://github.com/ai-dock/invokeai',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
  },
  {
    id: 'fooocus',
    name: 'Fooocus',
    repository: 'https://github.com/ai-dock/fooocus',
    pvs: '',
    supports: ['sdxl', 'pdxl'],
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
