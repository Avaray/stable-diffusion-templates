export interface Service {
  [key: string]: { name: string; ref: string; url: string; logo: string };
}

export const services: Service = {
  vastai: {
    name: 'Vast.ai',
    ref: '62878',
    url: 'https://cloud.vast.ai/create/?ref_id=62878&template_id=',
    logo: 'images/vastai.svg',
  },
  runpodio: {
    name: 'Runpod.io',
    ref: 'gzvzzzv9',
    url: 'https://runpod.io/console/deploy?ref=gzvzzzv9&template=',
    logo: 'images/runpodio.svg',
  },
};
