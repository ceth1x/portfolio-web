'use client'

import {forwardRef} from 'react'

type Props = {
  className?: string
  videoSrc: string
  posterSrc: string
  ready?: boolean
}

/**
 * Opening composition: scroll-scrubbed cinematic video + organic SVG line overlay.
 * Motion is applied imperatively from ScrollJourney — no React re-renders on scroll.
 */
export const OpeningScrollVisual = forwardRef<HTMLDivElement, Props>(function OpeningScrollVisual(
  {className, videoSrc, posterSrc, ready},
  ref,
) {
  return (
    <div
      ref={ref}
      className={`${className ?? ''}${ready ? ' is-ready' : ''}`.trim()}
      aria-hidden="true"
    >
      <div className="opening-video-shell" data-opening-video-shell>
        <video
          className="opening-video"
          data-opening-video
          src={videoSrc}
          poster={posterSrc}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>

      <svg
        className="opening-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g data-opening-group className="opening-group">
          <path
            data-draw="arc"
            className="opening-arc"
            d="M 62 8
               C 78 22, 54 38, 70 54
               C 84 68, 58 82, 74 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <g data-opening-split>
            <path
              data-draw="stem"
              className="opening-stem"
              d="M 76 4
                 C 90 16, 68 30, 82 44
                 C 94 56, 70 68, 84 80
                 C 92 88, 78 94, 80 98"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.55"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            <path
              data-draw="hair"
              className="opening-hair"
              d="M 78 10
                 C 88 20, 72 32, 84 42
                 C 92 50, 76 58, 82 66"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.28"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            <path
              data-draw="branch"
              className="opening-branch"
              d="M 82 44
                 C 92 46, 96 54, 94 64
                 C 92 72, 86 76, 88 82"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.38"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g data-opening-leaves className="opening-leaves">
            <path
              className="opening-leaf"
              d="M 86 28 C 90 26, 94 22, 93 18 C 89 21, 85 25, 82 28 C 84 29, 85 29, 86 28Z"
              fill="currentColor"
            />
            <path
              className="opening-leaf"
              d="M 74 52 C 70 50, 66 46, 68 42 C 71 45, 74 49, 77 52 C 76 53, 75 53, 74 52Z"
              fill="currentColor"
            />
            <path
              className="opening-leaf"
              d="M 90 70 C 94 68, 97 64, 96 60 C 92 63, 89 67, 86 70 C 88 71, 89 71, 90 70Z"
              fill="currentColor"
            />
            <path
              className="opening-seed"
              d="M 80 88 C 81.2 87.2, 82.4 87.2, 83.2 88 C 82.4 88.8, 81.2 88.8, 80 88Z"
              fill="currentColor"
            />
          </g>

          <g data-opening-nodes className="opening-nodes">
            <circle cx="80" cy="18" r="0.55" fill="currentColor" />
            <circle cx="76" cy="44" r="0.45" fill="currentColor" />
            <circle cx="84" cy="66" r="0.5" fill="currentColor" />
          </g>
        </g>
      </svg>

      <div className="opening-veil" />
    </div>
  )
})
