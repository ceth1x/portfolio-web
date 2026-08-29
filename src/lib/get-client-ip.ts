import {ipAddress} from '@vercel/functions'
import type {NextRequest} from 'next/server'

/**
 * Client IP for rate limiting on Vercel.
 * Uses @vercel/functions ipAddress(), which reads platform-trusted headers
 * rather than a client-controlled X-Forwarded-For value.
 */
export function getClientIp(request: NextRequest): string {
  return ipAddress(request) ?? 'unknown'
}
