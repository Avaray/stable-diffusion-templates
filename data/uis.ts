export interface UI {
  id: string;
  name: string;
  image: string;
  repository: string;
  pvs: string;
  pvsUrl: string;
  supports: string[];
  flags?: string;
  diskSpace?: number;
  env: string;
}

const universalPorts = [22, 1111, 8080, 8384, 72299].map((port) => `-p ${port}:${port}`).join(" ");

const universalEnv = `-e OPEN_BUTTON_PORT=1111 -e OPEN_BUTTON_TOKEN=1 -e JUPYTER_DIR=/ -e DATA_DIRECTORY=/workspace/`;

const userInterfaces: UI[] = [
  {
    id: "forge",
    name: "Forge",
    image: "vastai/sd-forge",
    repository: "https://github.com/vast-ai/base-image",
    pvs: "",
    pvsUrl:
      "https://raw.githubusercontent.com/vast-ai/base-image/refs/heads/main/derivatives/pytorch/derivatives/sd-forge/provisioning_scripts/default.sh",
    supports: ["sdxl", "pdxl"],
    flags: "",
    diskSpace: 40,
    env: [
      universalPorts,
      universalEnv,
      `-p 7860:7860 -e PORTAL_CONFIG="localhost:1111:11111:/:Instance Portal|localhost:7860:17860:/:WebUI Forge|localhost:8080:18080:/:Jupyter|localhost:8080:18080:/terminals/1:Jupyter Terminal|localhost:8384:18384:/:Syncthing" -e FORGE_ARGS="--xformers --api --cuda-malloc --cuda-stream --pin-shared-memory --port 17860`,
    ].join(" "),
  },
  {
    id: "comfy",
    name: "Comfy",
    image: "vastai/comfy",
    repository: "https://github.com/vast-ai/base-image",
    pvs: "",
    pvsUrl:
      "https://raw.githubusercontent.com/vast-ai/base-image/refs/heads/main/derivatives/pytorch/derivatives/comfyui/provisioning_scripts/default.sh",
    supports: ["sdxl", "pdxl"],
    flags: "",
    diskSpace: 40,
    env: [
      universalPorts,
      universalEnv,
      `-p 8188:8188 -e PORTAL_CONFIG="localhost:1111:11111:/:Instance Portal|localhost:8188:18188:/:ComfyUI|localhost:8080:18080:/:Jupyter|localhost:8080:18080:/terminals/1:Jupyter Terminal|localhost:8384:18384:/:Syncthing" -e COMFYUI_ARGS="--disable-auto-launch --port 18188 --enable-cors-header`,
    ].join(" "),
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
      const pvs = await fetchPvsData(ui.pvsUrl);
      return { ...ui, pvs };
    }),
  );
  return uisWithPvs;
}

export const uis = await getUisWithPvs();
