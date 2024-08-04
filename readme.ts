import { checkpoints, services } from './data';

let readme = await Bun.file('src/README.md').text();

const link = (service: string, templateId: string) => {
  const { name, url, logo } = services[service];
  return `<a href="${url}${templateId}"><img src="${logo}" alt="${name}" width="42" height="42"></a>`;
};

const tableRow = (x: (typeof checkpoints)[0]) => {
  const vastai = x.vastaiTemplateId ? link('vastai', x.vastaiTemplateId) : 'todo';
  const runpodio = x.runpodioTemplateId ? link('runpodio', x.runpodioTemplateId) : 'todo';
  return `| [${x.name}](${x.homepage}) | ${vastai} | ${runpodio} |`;
};

readme = readme.replace(
  /^.+{{sdxlStarters}}.*$/gm,
  `${checkpoints
    .filter((x) => x.base === 'sdxl')
    .map((x) => tableRow(x))
    .join('\n')}`,
);

readme = readme.replace(
  /^.+{{pdxlStarters}}.*$/gm,
  `${checkpoints
    .filter((x) => x.base === 'pdxl')
    .map((x) => tableRow(x))
    .join('\n')}`,
);

await Bun.write('README.md', readme);
