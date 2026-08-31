import {ImageResponse} from 'next/og'
import {siteConfig} from '@/lib/site-config'

export const alt = `${siteConfig.name} — Web Design & Development`
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#f4f0e8',
          color: '#1c2a22',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              background: '#1f4a36',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            FB
          </div>
          <div style={{fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em'}}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900}}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
            }}
          >
            Web design &amp; development
          </div>
          <div style={{fontSize: 30, lineHeight: 1.45, color: '#4a5c52', maxWidth: 820}}>
            Distinctive, high-performance websites for clients in the Netherlands.
          </div>
        </div>

        <div style={{fontSize: 24, color: '#1f4a36', fontWeight: 600}}>frontblender.com</div>
      </div>
    ),
    {...size},
  )
}
