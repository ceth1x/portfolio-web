'use client'

/**
 * Crisp SVG botanical stem — decorative divider only.
 * Winds within its own lane; never meant to interleave with typography.
 */
export function BotanicalLine({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Tall S-curve stem — stays inside botanical lane */}
      <path
        className="botanical-stem"
        d="M78 12
           C 118 90, 42 160, 88 250
           C 128 330, 38 400, 72 490
           C 110 580, 48 650, 86 740
           C 122 820, 58 890, 80 988"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      <path
        className="botanical-hair"
        d="M86 48
           C 112 110, 58 170, 92 230"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.32"
        vectorEffect="non-scaling-stroke"
      />

      {/* Sparse leaf marks */}
      <path
        className="botanical-leaf"
        d="M102 198 C 112 192, 120 184, 118 174 C 110 182, 100 190, 90 196 C 94 200, 98 200, 102 198Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        className="botanical-leaf"
        d="M52 392 C 42 386, 34 376, 38 368 C 44 376, 54 386, 66 392 C 60 396, 56 396, 52 392Z"
        fill="currentColor"
        opacity="0.46"
      />
      <path
        className="botanical-leaf"
        d="M98 612 C 108 606, 116 596, 114 588 C 106 596, 96 604, 86 610 C 90 614, 94 614, 98 612Z"
        fill="currentColor"
        opacity="0.48"
      />
      <path
        className="botanical-leaf"
        d="M58 812 C 48 806, 42 796, 46 788 C 52 796, 62 806, 72 812 C 66 816, 62 816, 58 812Z"
        fill="currentColor"
        opacity="0.42"
      />
    </svg>
  )
}
