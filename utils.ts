import { repoName, repoOwner } from "./constants.ts";
import process from "node:process";

export const runtime: "bun" | "deno" | undefined = typeof Bun !== "undefined" ? "bun" : typeof Deno !== "undefined" ? "deno" : undefined;

export async function saveFile(path: string, content: string) {
  switch (runtime) {
    case "bun":
      await Bun.write(path, content);
      break;
    case "deno":
      await Deno.writeTextFile(path, content);
      break;
    default:
      throw new Error("Unsupported runtime");
  }
}

export async function readFile(path: string): Promise<string> {
  switch (runtime) {
    case "bun":
      return await Bun.file(path).text();
    case "deno":
      return await Deno.readTextFile(path);
    default:
      throw new Error("Unsupported runtime");
  }
}

const templateReadme = await readFile("src/TEMPLATE.md");

export async function getEnvironmentVariable(
  name: string,
): Promise<string | undefined> {
  switch (runtime) {
    case "bun":
      return Bun.env[name];
    case "deno":
      return Deno.env.get(name);
    default:
      throw new Error("Unsupported runtime");
  }
}

interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  code?: number;
}

export async function executeCommand(
  command: string,
  args: any[] = [],
): Promise<CommandResult> {
  try {
    if (runtime === "deno") {
      const process = new Deno.Command(command, {
        args: args,
        stdout: "piped",
        stderr: "piped",
      });

      const { success, stdout, stderr, code } = await process.output();
      const decoder = new TextDecoder();

      return {
        success,
        output: decoder.decode(stdout),
        error: decoder.decode(stderr),
        code,
      };
    } else if (runtime === "bun") {
      const process = Bun.spawn([command, ...args], {
        stdout: "pipe",
        stderr: "pipe",
      });

      const output = await new Response(process.stdout).text();
      const error = await new Response(process.stderr).text();
      const exitCode = await process.exited;

      return {
        success: exitCode === 0,
        output,
        error: error || undefined,
        code: exitCode,
      };
    } else {
      throw new Error(`Unsupported runtime: ${runtime}`);
    }
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

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

// Get branch name
export async function getBranchName() {
  const branchName = await executeCommand("git", ["branch", "--show-current"]);
  // There is a newline at the end, I will use backslash to split the string
  return branchName.output.split("\\")[0].trim();
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
    // `${env} -e PROVISIONING_SCRIPT="${pvsUrl}" -e TIMESTAMP="${Date.now()}"`,
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

export const ratings: { [key: string]: [string, string] } = {
  u: ["⏳", "Needs more testing."],
  a: ["🔥", "It's fire!"],
  b: ["👍", "It's OK."],
  c: ["👎", "It's bad. Will be deleted probably."],
  d: ["💩", "It's crap"],
};
