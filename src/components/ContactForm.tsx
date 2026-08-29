'use client'

import {useState, type FormEvent} from 'react'
import {CONTACT_LIMITS, validateContactPayload} from '@/lib/contact-validation'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type FieldErrors = Partial<Record<'name' | 'email' | 'message' | 'subject', string>>

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (formState === 'submitting') return

    setFormError('')
    setFieldErrors({})

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
      company: String(formData.get('company') ?? ''),
    }

    const {ok, errors} = validateContactPayload(payload)
    if (!ok) {
      setFieldErrors(errors)
      return
    }

    setFormState('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as {
        ok?: boolean
        error?: string
        fields?: FieldErrors
      }

      if (!response.ok) {
        if (data.fields) {
          setFieldErrors(data.fields)
        }
        setFormError(data.error ?? 'Something went wrong. Please try again.')
        setFormState('error')
        return
      }

      form.reset()
      setFormState('success')
    } catch {
      setFormError('Unable to reach the server. Please check your connection and try again.')
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className="contact-form contact-form-success" aria-live="polite">
        <p className="contact-form-success-title">Message sent.</p>
        <p className="contact-form-success-copy">
          Thank you — your message is on its way. I&apos;ll get back to you as soon as I can.
        </p>
        <button
          type="button"
          className="text-cta text-cta-muted contact-form-reset"
          onClick={() => setFormState('idle')}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-grid">
        <div className="contact-field">
          <label className="contact-field-label" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name.max}
            className="contact-input"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
          />
          {fieldErrors.name ? (
            <p id="contact-name-error" className="contact-field-error" role="alert">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="contact-field">
          <label className="contact-field-label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            className="contact-input"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
          />
          {fieldErrors.email ? (
            <p id="contact-email-error" className="contact-field-error" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="contact-field contact-field-wide">
          <label className="contact-field-label" htmlFor="contact-subject">
            Subject <span className="contact-optional">(optional)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={CONTACT_LIMITS.subject.max}
            className="contact-input"
            aria-invalid={Boolean(fieldErrors.subject)}
            aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
          />
          {fieldErrors.subject ? (
            <p id="contact-subject-error" className="contact-field-error" role="alert">
              {fieldErrors.subject}
            </p>
          ) : null}
        </div>

        <div className="contact-field contact-field-wide">
          <label className="contact-field-label" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            maxLength={CONTACT_LIMITS.message.max}
            className="contact-input contact-textarea"
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
          />
          {fieldErrors.message ? (
            <p id="contact-message-error" className="contact-field-error" role="alert">
              {fieldErrors.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot — hidden from users, catches bots */}
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {formError ? (
        <p className="contact-form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="contact-form-actions">
        <button
          type="submit"
          className="btn btn-secondary contact-submit"
          disabled={formState === 'submitting'}
        >
          {formState === 'submitting' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  )
}
