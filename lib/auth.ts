import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'masa5-default-secret-key-2026';

// Password hashing with scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [salt, key] = hash.split(':');
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  branch?: string;
  exp: number;
}

// Generate signed token
export function createSessionToken(payload: Omit<SessionPayload, 'exp'>): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const data: SessionPayload = { ...payload, exp };
  const jsonStr = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(jsonStr)
    .digest('base64url');
  return `${jsonStr}.${signature}`;
}

// Verify signed token
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [jsonStr, signature] = token.split('.');
    if (!jsonStr || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(jsonStr)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(jsonStr, 'base64url').toString('utf8')
    );

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
