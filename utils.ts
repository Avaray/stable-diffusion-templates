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
export function getIds(data: string) {
  const id = data.match(/(?<=\Wid\W:\s?)\d+/m);
  const hash = data.match(/(?<=\Whash_id\W:\s?\W)\w+/m);
  if (id && hash) {
    return { id: id[0], hash: hash[0] };
  } else {
    return { id: null, hash: null };
  }
}

export function normalizeFilename(filename: string) {
  return filename.replace(/[^\w\.]+/g, "_").toLowerCase();
}

// Get branch name
export async function getBranchName() {
  const branchName = await executeCommand("git", ["branch", "--show-current"]);
  // There is a newline at the end, I will use backslash to split the string
  return branchName.output.split("\\")[0];
}
