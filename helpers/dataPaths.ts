import path from "path";
import { promises as fs } from "fs";

/**
 * Returns the root directory for persisted data. On Railway, a volume is
 * mounted at /data. You can override via DATA_DIR env var for local dev.
 */
export function getDataRoot(): string {
  const configured = process.env.DATA_DIR || process.env.DATA_PATH || "/data";
  return configured;
}

export function resolveDataPath(...segments: string[]): string {
  return path.join(getDataRoot(), ...segments);
}

export function getUploadsDir(): string {
  return resolveDataPath("uploads");
}

/**
 * Read JSON from the volume first, falling back to the repo path when missing.
 */
export async function readJsonFromDataOrRepo<T>(relativePath: string, fallback: T): Promise<T> {
  const volPath = resolveDataPath(relativePath);

  try {
    const raw = await fs.readFile(volPath, "utf8");

    return JSON.parse(raw || JSON.stringify(fallback)) as T;
  } catch { }

  const repoPath = path.join(process.cwd(), relativePath);

  try {
    const raw = await fs.readFile(repoPath, "utf8");

    return JSON.parse(raw || JSON.stringify(fallback)) as T;
  } catch { }

  return fallback;
}

/**
 * Ensure parent dir exists and write JSON to the volume.
 */
export async function writeJsonToData(relativePath: string, data: unknown): Promise<void> {
  const target = resolveDataPath(relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Ensure a file exists in the volume; if missing, create it with provided content.
 */
export async function ensureDataFile(relativePath: string, defaultContent: string): Promise<string> {
  const target = resolveDataPath(relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  try {
    await fs.access(target);
  } catch {
    await fs.writeFile(target, defaultContent, "utf8");
  }
  return target;
}


