'use client'

import {forwardRef} from 'react'

/**
 * Signature botanical branch — one continuous vine through the homepage journey.
 * All motion is scroll-driven from ScrollJourney (no React re-renders on scroll).
 */
export const BotanicalBranch = forwardRef<HTMLDivElement, {className?: string}>(
  function BotanicalBranch({className}, ref) {
  return (
    <div ref={ref} className={`botanical-branch${className ? ` ${className}` : ''}`} aria-hidden="true">
      <div className="botanical-branch-parallax" data-branch-parallax>
        <svg
          className="botanical-branch-svg"
          viewBox="0 0 160 1000"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g data-branch-sway className="botanical-branch-sway">
            <path
              data-branch="stem"
              className="branch-stem"
              d="M 82 6
                 C 108 78, 48 152, 86 232
                 C 124 312, 44 388, 76 468
                 C 108 548, 52 624, 84 700
                 C 116 776, 56 852, 80 928
                 C 94 972, 74 994, 80 998"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.05"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            <path
              data-branch="hair"
              className="branch-hair"
              d="M 84 42
                 C 104 98, 62 158, 90 218
                 C 108 268, 70 318, 88 368"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.48"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            <path
              data-branch="tendril"
              className="branch-tendril"
              d="M 86 232
                 C 108 248, 118 278, 112 312
                 C 106 342, 94 358, 100 384"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.42"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            <g data-branch-leaves>
              <g className="branch-leaf" data-leaf-at="0.14" data-rot="-28">
                <path
                  d="M 98 118 C 106 112, 114 104, 112 96 C 104 104, 96 112, 88 118 C 92 122, 95 122, 98 118Z"
                  fill="currentColor"
                />
              </g>
              <g className="branch-leaf" data-leaf-at="0.28" data-rot="22">
                <path
                  d="M 54 268 C 46 262, 38 254, 40 246 C 48 254, 56 262, 66 268 C 62 272, 58 272, 54 268Z"
                  fill="currentColor"
                />
              </g>
              <g className="branch-leaf" data-leaf-at="0.42" data-rot="-18">
                <path
                  d="M 102 398 C 110 392, 118 384, 116 376 C 108 384, 100 392, 90 398 C 94 402, 98 402, 102 398Z"
                  fill="currentColor"
                />
              </g>
              <g className="branch-leaf" data-leaf-at="0.56" data-rot="26">
                <path
                  d="M 48 548 C 40 542, 34 534, 36 526 C 42 534, 50 542, 60 548 C 56 552, 52 552, 48 548Z"
                  fill="currentColor"
                />
              </g>
              <g className="branch-leaf" data-leaf-at="0.7" data-rot="-22">
                <path
                  d="M 100 668 C 108 662, 116 654, 114 646 C 106 654, 98 662, 88 668 C 92 672, 96 672, 100 668Z"
                  fill="currentColor"
                />
              </g>
              <g className="branch-leaf" data-leaf-at="0.84" data-rot="16">
                <path
                  d="M 56 812 C 48 806, 42 798, 44 790 C 50 798, 58 806, 68 812 C 64 816, 60 816, 56 812Z"
                  fill="currentColor"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
},
)
