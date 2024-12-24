export interface Service {
  [key: string]: { name: string; ref: string; url: string; logo: string };
}

export const services: Service = {
  vastai: {
    name: "Vast.ai",
    ref: "62878",
    get url() {
      return `https://cloud.vast.ai/create/?ref_id=${this.ref}&template_id=`;
    },
    logo: "images/vastai.svg",
  },
  runpodio: {
    name: "Runpod.io",
    ref: "gzvzzzv9",
    get url() {
      return `https://runpod.io/console/deploy?ref=${this.ref}&template=`;
    },
    logo: "images/runpodio.svg",
  },
};

//
export const vastai = {
  createTemplate: () => {},
  deleteTemplate: () => {},
  updateTemplate: () => {},
  getTemplate: (id?: string, hash?: string) => {},
};

export const runpodio = {
  createTemplate: () => {},
  deleteTemplate: () => {},
  updateTemplate: () => {},
  getTemplate: (id?: string, hash?: string) => {},
};
