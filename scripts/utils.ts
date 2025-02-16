import { repoName, repoOwner } from "../scripts/constants.ts";
import process from "node:process";

const templateReadme = Deno.readTextFileSync("src/TEMPLATE.md");

export const ratings: { [key: string]: [string, string] } = {
  u: ["⏳", "Needs more testing."],
  a: ["🔥", "It's fire!"],
  b: ["👍", "It's OK."],
  c: ["👎", "It's bad. Will be deleted probably."],
  d: ["💩", "It's crap"],
};

export const getNormalizedUrl = (url: string) => {
  try {
    const normalizedUrl = new URL(url);
    return normalizedUrl.href;
  } catch (_error) {
    console.error(`Error normalizing URL: ${url}`);
    // Return the original URL if normalization fails
    return url;
  }
};

// Use regex to get ID and Hash from the output
// Can't parse JSON just like that because it contains single quotes in it
export function getId(data: string) {
  let id;
  id = data.match(/(?<=\Wid\W:\s?)\d+/m);
  id = id || data.match(/(?<=Found:\s?)\d+/i);
  return id ? id[0] : null;
}

export function normalizeFilename(filename: string) {
  return filename.replace(/[^\w\.]+/g, "_").toLowerCase().replace(
    ".safetensors",
    "",
  );
}

export async function getBranchName() {
  const branchName = await executeCommand("git", ["branch", "--show-current"]);
  return branchName.output;
}

export function pvsUrl(ui: any, branch: string, filename: string) {
  return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/${branch}/scripts/${ui.id}/${filename}.sh`;
}

export async function createVastaiTemplate(
  name: string,
  image: string,
  env: string,
  pvsUrl: string,
  description: string = "Created by Avaray",
) {
  const createTemplate = await executeCommand("python", [
    "vastai",
    "create",
    "template",
    "--name",
    name,
    "--desc",
    description,
    "--disk_space",
    40.0,
    "--image",
    image,
    "--image_tag",
    "latest",
    "--href",
    "https://github.com/Avaray/stable-diffusion-templates",
    "--readme",
    templateReadme,
    "--onstart-cmd",
    "env | grep _ >> /etc/environment; /opt/ai-dock/bin/init.sh;",
    "--env",
    `${env} -e PROVISIONING_SCRIPT="${pvsUrl}"`,
    "--search_params",
    "disk_space>=40 reliability>89 inet_up>99 inet_down>299",
    "--jupyter",
    "--direct",
    "--ssh",
    "--no-default",
    "--public",
  ]);

  const id = getId(createTemplate.output);

  console.log(createTemplate);

  return id;
}

export async function deleteVastaiTemplate(id: number) {
  const deleteTemplate = await executeCommand("python", [
    "vastai",
    "delete",
    "template",
    `--template`,
    id,
  ]);
}

export async function createRunpodTemplate(
  name: string,
  image: string,
  env: string,
  pvsUrl: string,
  description: string = "Created by Avaray",
  ports: string,
  readme: string,
) {
  const url = `https://api.runpod.io/graphql?api_key=${process.env.RUNPOD_KEY}`;
  const query = `
    mutation {
      saveTemplate(input: {
        containerDiskInGb: 40,
        dockerArgs: "",
        env: [
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" }
        ],
        imageName: "${image}:latest",
        name: "${name}",
        ports: "${ports}",
        readme: "${readme}",
        volumeInGb: 15,
        volumeMountPath: "/workspace"
      }) {
        containerDiskInGb
        dockerArgs
        env { key value }
        id
        imageName
        name
        ports
        readme
        volumeInGb
        volumeMountPath
      }
    }
    `;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}
