export type ContactPayload = {
  name: string
  email: string
  message: string
  subject?: string
  company?: string
}

export type ContactFieldErrors = Partial<Record<'name' | 'email' | 'message' | 'subject', string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const CONTACT_LIMITS = {
  name: {min: 1, max: 100},
  email: {max: 254},
  subject: {max: 200},
  message: {min: 10, max: 5000},
} as const

export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

export function sanitizeContactInput(raw: unknown): ContactPayload {
  const data = (raw ?? {}) as Record<string, unknown>

  return {
    name: stripControlChars(String(data.name ?? '')),
    email: stripControlChars(String(data.email ?? '')).toLowerCase(),
    message: stripControlChars(String(data.message ?? '')),
    subject: stripControlChars(String(data.subject ?? '')),
    company: stripControlChars(String(data.company ?? '')),
  }
}

export function validateContactPayload(payload: ContactPayload): {
  ok: boolean
  errors: ContactFieldErrors
} {
  const errors: ContactFieldErrors = {}

  if (payload.name.length < CONTACT_LIMITS.name.min) {
    errors.name = 'Please enter your name.'
  } else if (payload.name.length > CONTACT_LIMITS.name.max) {
    errors.name = `Name must be ${CONTACT_LIMITS.name.max} characters or fewer.`
  }

  if (!payload.email) {
    errors.email = 'Please enter your email address.'
  } else if (payload.email.length > CONTACT_LIMITS.email.max) {
    errors.email = 'Email address is too long.'
  } else if (!EMAIL_PATTERN.test(payload.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (payload.message.length < CONTACT_LIMITS.message.min) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.message.min} characters.`
  } else if (payload.message.length > CONTACT_LIMITS.message.max) {
    errors.message = `Message must be ${CONTACT_LIMITS.message.max} characters or fewer.`
  }

  if (payload.subject && payload.subject.length > CONTACT_LIMITS.subject.max) {
    errors.subject = `Subject must be ${CONTACT_LIMITS.subject.max} characters or fewer.`
  }

  return {ok: Object.keys(errors).length === 0, errors}
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
