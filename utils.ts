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
