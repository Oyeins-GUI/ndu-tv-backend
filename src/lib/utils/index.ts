import { Request } from 'express';

import * as crypto from 'crypto';

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const cfConnectingIp = req.headers['cf-connecting-ip'];

  // Try X-Forwarded-For first (comma-separated list, first one is original client)
  if (typeof forwardedFor === 'string') {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    if (ips[0] && ips[0] !== '::1') return ips[0];
  }

  // Try Cloudflare's specific header
  if (typeof cfConnectingIp === 'string' && cfConnectingIp !== '::1')
    return cfConnectingIp;

  // Try X-Real-IP
  if (typeof realIp === 'string' && realIp !== '::1') return realIp;

  // Handle localhost cases and fallback
  const ip = req.ip;
  if (!ip || ip === '::1' || ip === '::ffff:127.0.0.1') return 'localhost';

  return ip;
}

export function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function calculateRemainingTime(expirationTimestamp: number): number {
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = expirationTimestamp - currentTime;
  return Math.max(remainingTime, 60);
}

export function generateRandomCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export function expireInMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Generates a random token for temporary operations (password reset, email verification, etc.)
 * @param length - Length of the token in characters (default: 16)
 * @returns Random hex string
 */
export function generateRandomToken(length: number = 16): string {
  const bytes = Math.ceil(length / 2);
  return crypto.randomBytes(bytes).toString('hex').slice(0, length);
}

export function generateOtp(length: number = 6): string {
  const max = 10 ** length;
  const code = crypto.randomInt(0, max);
  return code.toString().padStart(length, '0');
}

// export function encrypt(data: string, key?: string) {
//   const realKey = key ? Buffer.from(key, 'hex') : MASTER_KEY;
//   const iv = crypto.randomBytes(IV_LENGTH);
//   const cipher = crypto.createCipheriv('aes-256-cbc', realKey, iv);
//   let encrypted = cipher.update(data, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return iv.toString('hex') + ':' + encrypted;
// }

// export function decrypt(data: string, key?: string) {
//   const realKey = key ? Buffer.from(key, 'hex') : MASTER_KEY;
//   const [ivHex, encrypted] = data.split(':');
//   const iv = Buffer.from(ivHex, 'hex');
//   const decipher = crypto.createDecipheriv('aes-256-cbc', realKey, iv);
//   let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }
