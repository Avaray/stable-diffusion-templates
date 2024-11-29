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
