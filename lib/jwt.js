import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

export async function createToken(payload) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // 24 hours

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);

  return jwt;
}

export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}