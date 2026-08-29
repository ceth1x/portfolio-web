import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {Resend} from 'resend'
import {
  escapeHtml,
  sanitizeContactInput,
  validateContactPayload,
} from '@/lib/contact-validation'
import {getClientIp} from '@/lib/get-client-ip'
import {checkRateLimit} from '@/lib/rate-limit'

export const runtime = 'nodejs'

const RATE_WINDOW_MS = 15 * 60 * 1000
const POST_RATE_LIMIT = 30
const SEND_RATE_LIMIT = 5
const MAX_BODY_BYTES = 32 * 1024

function rateLimitResponse(retryAfterSec: number, message: string) {
  return NextResponse.json(
    {error: message},
    {
      status: 429,
      headers: {'Retry-After': String(retryAfterSec)},
    },
  )
}

async function readJsonBody(
  request: NextRequest,
  maxBytes: number,
): Promise<{ok: true; body: unknown} | {ok: false; response: NextResponse}> {
  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    const length = Number.parseInt(contentLength, 10)
    if (!Number.isFinite(length) || length > maxBytes) {
      return {
        ok: false,
        response: NextResponse.json({error: 'Request body is too large.'}, {status: 413}),
      }
    }
  }

  const rawBody = await request.text()
  if (rawBody.length > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json({error: 'Request body is too large.'}, {status: 413}),
    }
  }

  if (!rawBody) {
    return {
      ok: false,
      response: NextResponse.json({error: 'Invalid request body.'}, {status: 400}),
    }
  }

  try {
    return {ok: true, body: JSON.parse(rawBody)}
  } catch {
    return {
      ok: false,
      response: NextResponse.json({error: 'Invalid request body.'}, {status: 400}),
    }
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  const postRate = checkRateLimit(`contact:post:${ip}`, POST_RATE_LIMIT, RATE_WINDOW_MS)
  if (!postRate.allowed) {
    return rateLimitResponse(postRate.retryAfterSec, 'Too many requests. Please try again later.')
  }

  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    return parsed.response
  }

  const payload = sanitizeContactInput(parsed.body)

  if (payload.company) {
    return NextResponse.json({ok: true})
  }

  const {ok, errors} = validateContactPayload(payload)
  if (!ok) {
    return NextResponse.json({error: 'Validation failed.', fields: errors}, {status: 400})
  }

  const sendRate = checkRateLimit(`contact:send:${ip}`, SEND_RATE_LIMIT, RATE_WINDOW_MS)
  if (!sendRate.allowed) {
    return rateLimitResponse(
      sendRate.retryAfterSec,
      'Too many messages sent. Please try again later.',
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? 'boumanphilippe@gmail.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev'

  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured.')
    return NextResponse.json(
      {error: 'Email service is not configured. Please try again later.'},
      {status: 503},
    )
  }

  const resend = new Resend(apiKey)
  const subjectLine = payload.subject
    ? `[Portfolio] ${payload.subject}`
    : `[Portfolio] Message from ${payload.name}`

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c2a22;">
      <p style="margin: 0 0 1rem;"><strong>New portfolio message</strong></p>
      <p style="margin: 0 0 0.5rem;"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p style="margin: 0 0 0.5rem;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      ${
        payload.subject
          ? `<p style="margin: 0 0 0.5rem;"><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>`
          : ''
      }
      <p style="margin: 1rem 0 0.5rem;"><strong>Message:</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
    </div>
  `

  const text = [
    'New portfolio message',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.subject ? `Subject: ${payload.subject}` : null,
    '',
    'Message:',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n')

  const {error} = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email,
    subject: subjectLine,
    html,
    text,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json(
      {error: 'Unable to send your message right now. Please try again later.'},
      {status: 502},
    )
  }

  return NextResponse.json({ok: true})
}
