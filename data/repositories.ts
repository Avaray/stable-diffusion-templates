const repoNames: { [key: string]: string } = {
  sdxl: 'sdxl-1-0-models-backup',
  pdxl: 'sdxl-pony-models-backup',
};

const baseUrl = (repo: string) =>
  `https://huggingface.co/datasets/AddictiveFuture/${repo}/resolve/main/`;

export const repositories: { [key: string]: string } = {
  sdxl: baseUrl(repoNames.sdxl),
  pdxl: baseUrl(repoNames.pdxl),
};
