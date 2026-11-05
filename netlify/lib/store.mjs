/**
 * Storage for portal content and uploaded files, using Netlify Blobs.
 * On Netlify this needs no setup. For local testing (tools/dev-server.mjs),
 * set GIDM_LOCAL_STORE to a folder and files are kept on disk instead.
 */
import { getStore } from '@netlify/blobs';
import fs from 'node:fs/promises';
import path from 'node:path';

function localStore(name) {
  const root = path.join(process.env.GIDM_LOCAL_STORE, name);
  const file = (key) => path.join(root, encodeURIComponent(key));
  const meta = (key) => file(key) + '.__meta.json';
  return {
    async get(key, opts = {}) {
      try {
        const buf = await fs.readFile(file(key));
        if (opts.type === 'json') return JSON.parse(buf.toString('utf8'));
        if (opts.type === 'arrayBuffer') return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return buf.toString('utf8');
      } catch { return null; }
    },
    async getWithMetadata(key, opts = {}) {
      const data = await this.get(key, opts);
      if (data === null) return null;
      let metadata = {};
      try { metadata = JSON.parse(await fs.readFile(meta(key), 'utf8')); } catch {}
      return { data, metadata };
    },
    async set(key, data, { metadata } = {}) {
      await fs.mkdir(root, { recursive: true });
      const buf = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data instanceof ArrayBuffer ? data : await new Response(data).arrayBuffer());
      await fs.writeFile(file(key), buf);
      if (metadata) await fs.writeFile(meta(key), JSON.stringify(metadata));
    },
    async setJSON(key, data, opts) { return this.set(key, JSON.stringify(data), opts); },
    async delete(key) { await fs.rm(file(key), { force: true }); await fs.rm(meta(key), { force: true }); },
    async list({ prefix = '' } = {}) {
      let names = [];
      try { names = await fs.readdir(root); } catch {}
      const blobs = names.filter((n) => !n.endsWith('.__meta.json')).map((n) => ({ key: decodeURIComponent(n) })).filter((b) => b.key.startsWith(prefix));
      return { blobs };
    },
  };
}

export function store(name) {
  if (process.env.GIDM_LOCAL_STORE) return localStore(name);
  return getStore({ name, consistency: 'strong' });
}

/** Portal content (JSON documents). */
export const content = () => store('gidm-content');
/** Uploaded files: photos, logos, newsletter PDFs and pages. */
export const media = () => store('gidm-media');

export async function readJSON(key, fallback) {
  try {
    const v = await content().get(key, { type: 'json' });
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export async function writeJSON(key, value) {
  await content().setJSON(key, value);
}
