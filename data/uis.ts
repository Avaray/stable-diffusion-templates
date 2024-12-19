export interface UI {
  id: string;
  name: string;
  image: string;
  repository: string;
  pvs: string;
  supports: string[];
  flags?: string;
  diskSpace?: number;
  env: string;
}

const defaultPvsUrl = (repository: string) => {
  const repo = repository.split("/").slice(-2).join("/");
  return `https://raw.githubusercontent.com/${repo}/refs/heads/main/config/provisioning/default.sh`;
};

const universalEnv =
  `-e WEB_ENABLE_HTTPS=true -e DATA_DIRECTORY=/workspace/ -e WORKSPACE=/workspace/ -e WORKSPACE_MOUNTED=force -e JUPYTER_DIR=/ -e SYNCTHING_TRANSPORT_PORT_HOST=72299 -e OPEN_BUTTON_TOKEN=1 -e OPEN_BUTTON_PORT=1111 -p 22:22 -p 1111:1111 -p 7860:7860 -p 8384:8384 -p 8888:8888 -p 72299:72299`;

const userInterfaces: UI[] = [
  {
    id: "forge",
    name: "Forge",
    image: "ghcr.io/ai-dock/stable-diffusion-webui-forge",
    repository: "https://github.com/ai-dock/stable-diffusion-webui-forge",
    pvs: "",
    supports: ["sdxl", "pdxl"],
    flags: "",
    diskSpace: 40,
    env: `${universalEnv} -e FORGE_ARGS=""`,
  },
  {
    id: "comfy",
    name: "Comfy",
    image: "ghcr.io/ai-dock/comfyui",
    repository: "https://github.com/ai-dock/comfyui",
    pvs: "",
    supports: ["sdxl", "pdxl"],
    flags: "",
    diskSpace: 40,
    env: `${universalEnv} -e COMFYUI_ARGS="" -e COMFYUI_PORT_HOST=8188 -p 8188:8188`,
  },
  {
    id: "invoke",
    name: "Invoke",
    image: "ghcr.io/ai-dock/invokeai",
    repository: "https://github.com/ai-dock/invokeai",
    pvs: "",
    supports: ["sdxl", "pdxl"],
    flags: "",
    diskSpace: 40,
    env: `${universalEnv} -e INVOKEAI_PORT_HOST=9090 -p 9090:9090`,
  },
  {
    id: "fooocus",
    name: "Fooocus",
    image: "ghcr.io/ai-dock/fooocus",
    repository: "https://github.com/ai-dock/fooocus",
    pvs: "",
    supports: ["sdxl", "pdxl"],
    flags: "",
    diskSpace: 40,
    env: `${universalEnv} -e FOOOCUS_ARGS="--disable-preset-download --disable-analytics" -e FOOOCUS_PORT_HOST=7865 -p 7865:7865`,
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
    return "";
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
