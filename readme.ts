import { readFile } from "./utils.ts";
import { services } from "./data/services.ts";
import { checkpoints } from "./data/checkpoints.ts";
import templates from "./data/templates.json" with { type: "json" };

let readme = await readFile("src/README.md");

console.log(readme);

process.exit(0);

const link = (service: string, templateId: string) => {
  const { name, url, logo } = services[service];
  return `<a href="${url}${templateId}"><img src="${logo}" alt="${name}" width="42" height="42"></a>`;
};

const tableRow = (x: (typeof checkpoints)[0]) => {
  const vastai = x.vastaiTemplateId ? link("vastai", x.vastaiTemplateId) : "todo";
  const runpodio = x.runpodioTemplateId ? link("runpodio", x.runpodioTemplateId) : "todo";
  return `| ${rating(x)} | [${x.name}](${x.homepage}) | \`V${x.version}\` | ${vastai} | ${runpodio} |`;
};

readme = readme.replace(
  /^.+{{sdxlStarters}}.*$/gm,
  `${
    checkpoints
      .filter((x) => x.base === "sdxl")
      .map((x) => tableRow(x))
      .join("\n")
  }`,
);

readme = readme.replace(
  /^.+{{pdxlStarters}}.*$/gm,
  `${
    checkpoints
      .filter((x) => x.base === "pdxl")
      .map((x) => tableRow(x))
      .join("\n")
  }`,
);

await Bun.write("README.md", readme);
