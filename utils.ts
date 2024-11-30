import { repoOwner, repoName } from "./constants";

export const runtime: "bun" | "deno" | undefined = typeof Bun !== "undefined"
  ? "bun"
  : typeof Deno !== "undefined"
    ? "deno"
    : undefined;

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
  return filename.replace(/[^\w\.]+/g, "_").toLowerCase().replace('.safetensors', '');
}

// Get branch name
export async function getBranchName() {
  const branchName = await executeCommand("git", ["branch", "--show-current"]);
  // There is a newline at the end, I will use backslash to split the string
  return branchName.output.split("\\")[0];
}

export function pvsUrl(ui: any, branch: string, filename: string) {
  return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/${branch}/scripts/${ui.id}/${filename}.sh`;
}

export async function createVastaiTemplate(
  name: string,
  pvsUrl: string,
  image: string,
  flags: string,
) {
  const createTemplate = await executeCommand("vastai", [
    "create",
    "template",
    "--disk_space",
    40.0,
    "--name",
    name,
    "--image",
    image,
    "--image_tag",
    "latest",
    "--onstart-cmd",
    "env | grep _ >> /etc/environment; /opt/ai-dock/bin/init.sh;",
    "--env",
    `-e DATA_DIRECTORY=/workspace/ -e WORKSPACE=/workspace/ -e WORKSPACE_MOUNTED=force -e SYNCTHING_TRANSPORT_PORT_HOST=72299 -p 8384:8384 -p 72299:72299 -e JUPYTER_DIR=/ -e WEBUI_BRANCH=master -e WEBUI_FLAGS=\"${flags}\" -e JUPYTER_PASSWORD=password -e PROVISIONING_SCRIPT=\"${pvsUrl}\" -p 22:22 -p 1111:1111 -p 7860:7860 -p 8888:8888 -e OPEN_BUTTON_TOKEN=1 -e OPEN_BUTTON_PORT=1111`,
    "--jupyter",
    "--direct",
  ]);

  const id = getId(createTemplate.output);

  return id;
}
