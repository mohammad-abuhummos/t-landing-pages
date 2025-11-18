import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

function buildMongoUri(): string {
  // Prefer explicit env var if provided
  const envUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO_URI;
  if (envUri) return envUri;

  // Fallback to Railway-provided credentials (as shared by the user)
  const user = process.env.MONGODB_USER || "mongo";
  const pass = process.env.MONGODB_PASSWORD || "DnHnsuGCcJeYqiSDkKLnNemLGYTpPqGW";
  const host = process.env.MONGODB_HOST || "ballast.proxy.rlwy.net";
  const port = Number(process.env.MONGODB_PORT || 46376);

  // Use direct connection over standard mongodb protocol. Enable retryWrites off if proxy doesn't support it.
  const params = new URLSearchParams({
    retryWrites: "true",
    w: "majority",
  });

  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/?${params.toString()}`;
}

function getDbName(): string {
  return process.env.MONGODB_DB || process.env.MONGO_DB || "ly_landing";
}

export async function getDb(): Promise<Db> {
  if (cachedDb && cachedClient) return cachedDb;

  const uri = buildMongoUri();
  const client = new MongoClient(uri, {
    // Keepalive and pool settings to avoid cold-start overhead
    maxPoolSize: 10,
  });

  await client.connect();
  const db = client.db(getDbName());

  cachedClient = client;
  cachedDb = db;
  return db;
}

export async function getCollection<T = any>(name: string) {
  const db = await getDb();
  return db.collection<T>(name);
}


