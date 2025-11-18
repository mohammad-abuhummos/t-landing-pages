/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

function buildMongoUri() {
  const envUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO_URI;
  if (envUri) return envUri;
  const user = process.env.MONGODB_USER || 'mongo';
  const pass = process.env.MONGODB_PASSWORD || 'DnHnsuGCcJeYqiSDkKLnNemLGYTpPqGW';
  const host = process.env.MONGODB_HOST || 'ballast.proxy.rlwy.net';
  const port = Number(process.env.MONGODB_PORT || 46376);
  const params = new URLSearchParams({ retryWrites: 'true', w: 'majority' });
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/?${params.toString()}`;
}

function getDbName() {
  return process.env.MONGODB_DB || process.env.MONGO_DB || 'ly_landing';
}

function isImage(name) {
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(name);
}

function getMimeType(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function listImages(dir) {
  try {
    const files = await fs.promises.readdir(dir);
    return files.filter(isImage);
  } catch {
    return [];
  }
}

(async () => {
  const uri = buildMongoUri();
  const dbName = getDbName();
  const client = new MongoClient(uri, { maxPoolSize: 5 });
  await client.connect();
  console.log('Connected to Mongo');
  const db = client.db(dbName);

  // Drop database
  await db.dropDatabase();
  console.log('Dropped database', dbName);

  const configs = db.collection('configs');
  const images = db.collection('images');

  const projectRoot = process.cwd();
  const partnersPath = path.join(projectRoot, 'config', 'partners.json');
  const heroesPath = path.join(projectRoot, 'config', 'heroes.json');
  const srcMapPath = path.join(projectRoot, 'config', 'srcMap.json');

  const partners = await readJson(partnersPath, []);
  const heroes = await readJson(heroesPath, {});
  const srcMap = await readJson(srcMapPath, {});

  await configs.updateOne({ _id: 'partners' }, { $set: { data: partners, updatedAt: new Date() } }, { upsert: true });
  await configs.updateOne({ _id: 'heroes' }, { $set: { data: heroes, updatedAt: new Date() } }, { upsert: true });
  await configs.updateOne({ _id: 'srcMap' }, { $set: { data: srcMap, updatedAt: new Date() } }, { upsert: true });
  console.log('Seeded configs');

  const publicUploads = path.join(projectRoot, 'public', 'uploads');
  const dataUploads = path.join('/data', 'uploads');

  const sources = [publicUploads, dataUploads];
  let migrated = 0;
  for (const dir of sources) {
    const files = await listImages(dir);
    for (const name of files) {
      try {
        const filePath = path.join(dir, name);
        const buf = await fs.promises.readFile(filePath);
        const base64 = buf.toString('base64');
        const mimeType = getMimeType(name);
        await images.updateOne(
          { _id: name },
          { $set: { data: base64, mimeType, service: null, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true }
        );
        migrated++;
      } catch {}
    }
  }

  const partnersCount = Array.isArray(partners) ? partners.length : 0;
  const heroesKeys = Object.keys(heroes || {});
  const srcMapKeys = Object.keys(srcMap || {});
  const imagesCount = await images.countDocuments();

  console.log(JSON.stringify({ partnersCount, heroesKeys, srcMapKeys, imagesCount, migrated }, null, 2));
  await client.close();
})().catch((e) => { console.error(e?.message || e); process.exit(1); });


