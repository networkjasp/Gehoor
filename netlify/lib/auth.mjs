/**
 * Portal login. Passwords are only ever stored as bcrypt hashes: the built-in
 * starting hash below, and after a password change in Netlify's private storage.
 */
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { readJSON, writeJSON } from './store.mjs';

const COOKIE = 'gidm_admin';

/**
 * Built-in starting login: username "Admin" with the practice's starting password.
 * Only the bcrypt hash is stored here (the password itself is not in the code).
 * It works straight after deploying. After the first password change in
 * Portal › Settings, the new password is used and this value is ignored.
 * (An ADMIN_PASSWORD_HASH environment variable in Netlify overrides it, if ever needed.)
 */
const BUILT_IN_USER = 'Admin';
const BUILT_IN_HASH = '$2y$10$Rji9UX/9FoDQtLb0qDcWg.cTzM3pnkZvNm28tGRwMzYWAXGRSPNB6';
const IDLE_SECONDS = 30 * 60;

export async function getAuth() {
  const stored = await readJSON('auth', null);
  if (stored?.hash) return { ...stored, source: 'portal' };
  const env = process.env.ADMIN_PASSWORD_HASH || '';
  if (/^\$2[aby]\$\d\d\$/.test(env)) return { user: process.env.ADMIN_USER || BUILT_IN_USER, hash: env, changed: null, source: 'env' };
  return { user: BUILT_IN_USER, hash: BUILT_IN_HASH, changed: null, source: 'built-in' };
}

async function secret() {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) return process.env.SESSION_SECRET;
  const s = await readJSON('secret', null);
  if (s?.key) return s.key;
  const key = crypto.randomBytes(32).toString('hex');
  await writeJSON('secret', { key });
  return key;
}

const b64 = (s) => Buffer.from(s).toString('base64url');
const sign = async (payload) => crypto.createHmac('sha256', await secret()).update(payload).digest('base64url');

export async function makeSessionCookie(user, secure = true) {
  const payload = b64(JSON.stringify({ u: user, exp: Math.floor(Date.now() / 1000) + IDLE_SECONDS }));
  const token = payload + '.' + (await sign(payload));
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${IDLE_SECONDS}${secure ? '; Secure' : ''}`;
}

export const clearSessionCookie = (secure = true) => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`;

export async function readSession(req) {
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [payload, sig] = m[1].split('.');
  if (!payload || !sig) return null;
  const expected = await sign(payload);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now() / 1000) return null;
    return data;
  } catch {
    return null;
  }
}

export async function checkPassword(user, pass) {
  const auth = await getAuth();
  if (!auth) return false;
  const userOk = String(user || '').trim().toLowerCase() === String(auth.user).toLowerCase();
  const passOk = await bcrypt.compare(String(pass || ''), auth.hash);
  return userOk && passOk ? auth.user : false;
}

export async function changePassword(current, next, newUser) {
  const auth = await getAuth();
  if (!auth || !(await bcrypt.compare(String(current || ''), auth.hash))) throw new Error('Your current password is incorrect.');
  if (String(next).length < 10) throw new Error('The new password must be at least 10 characters.');
  const user = String(newUser || auth.user).trim().slice(0, 40) || auth.user;
  await writeJSON('auth', { user, hash: await bcrypt.hash(String(next), 12), changed: new Date().toISOString() });
  return user;
}

/** Login rate limit: 5 failed attempts per 15 minutes per visitor. */
export async function throttleCheck(ip, record) {
  const key = crypto.createHash('sha256').update(String(ip || '0')).digest('hex').slice(0, 24);
  const all = await readJSON('throttle', {});
  const now = Date.now();
  for (const k of Object.keys(all)) all[k] = (all[k] || []).filter((t) => t > now - 15 * 60 * 1000);
  const hits = all[key] || [];
  const allowed = hits.length < 5;
  if (record) {
    all[key] = [...hits, now];
    for (const k of Object.keys(all)) if (!all[k].length) delete all[k];
    await writeJSON('throttle', all);
  }
  return allowed;
}
