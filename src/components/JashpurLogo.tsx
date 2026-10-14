import React from 'react';

interface JashpurLogoProps {
  className?: string;
  size?: number | string;
}

export const JashpurLogo: React.FC<JashpurLogoProps> = ({ className = 'w-10 h-10', size }) => {
  return (
    <svg
      viewBox="0 0 500 500"
      className={`${className} shrink-0`}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Jashpur News Logo"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="skyGrad" x1="250" y1="40" x2="250" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f0f7ff" />
          <stop offset="100%" stopColor="#e2eeff" />
        </linearGradient>

        <linearGradient id="sunGrad" x1="220" y1="110" x2="220" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="50%" stopColor="#FFAE00" />
          <stop offset="100%" stopColor="#FFDE00" />
        </linearGradient>

        <linearGradient id="mountainBack" x1="250" y1="130" x2="250" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5D92BA" />
          <stop offset="100%" stopColor="#3B739B" />
        </linearGradient>

        <linearGradient id="mountainFront" x1="250" y1="160" x2="250" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>

        <linearGradient id="redRibbonGrad" x1="50" y1="210" x2="420" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D9161C" />
          <stop offset="50%" stopColor="#C71920" />
          <stop offset="100%" stopColor="#AC1017" />
        </linearGradient>

        <linearGradient id="micMetal" x1="430" y1="170" x2="460" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#333333" />
          <stop offset="50%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>

        {/* Drop Shadows */}
        <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
        </filter>
        <filter id="ribbonShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer White Background Circle */}
      <circle cx="250" cy="250" r="240" fill="#ffffff" filter="url(#badgeShadow)" />

      {/* Outer Red Ring */}
      <circle cx="250" cy="250" r="236" stroke="#C71920" strokeWidth="18" fill="none" />

      {/* Inner Mask for Landscape */}
      <g clipPath="url(#topCircleClip)">
        <clipPath id="topCircleClip">
          <circle cx="250" cy="250" r="226" />
        </clipPath>

        {/* Sky */}
        <rect x="20" y="20" width="460" height="260" fill="url(#skyGrad)" />

        {/* Rising Golden Sun */}
        <circle cx="210" cy="155" r="46" fill="url(#sunGrad)" />

        {/* Distant Birds */}
        <path d="M235 92 Q245 84 255 92 Q265 84 275 92 Q265 88 255 90 Q245 88 235 92 Z" fill="#182230" />
        <path d="M260 106 Q268 99 276 106 Q284 99 292 106 Q284 102 276 104 Q268 102 260 106 Z" fill="#182230" />

        {/* Back Mountains (Blue Ridge) */}
        <path
          d="M100 230 C150 180 200 145 260 160 C320 175 370 140 430 190 L430 250 L100 250 Z"
          fill="url(#mountainBack)"
        />

        {/* Front Rolling Green Hills */}
        <path
          d="M40 250 C90 200 160 180 220 200 C280 220 340 190 440 240 L440 270 L40 270 Z"
          fill="url(#mountainFront)"
        />

        {/* Evergreen Pine Trees on the Left */}
        <g fill="#124E18">
          {/* Tree 1 */}
          <polygon points="100,245 88,245 88,205 76,205 94,165 112,205 100,205" />
          <polygon points="94,145 82,185 106,185" />
          <polygon points="94,125 85,160 103,160" />
          {/* Tree 2 (Taller) */}
          <polygon points="135,245 125,245 125,190 110,190 130,135 150,190 135,190" />
          <polygon points="130,110 115,155 145,155" />
          <polygon points="130,90 120,130 140,130" />
          {/* Tree 3 */}
          <polygon points="165,245 155,245 155,200 145,200 160,160 175,200 165,200" />
          <polygon points="160,135 150,170 170,170" />
        </g>

        {/* Green District Map Silhouette (Top Right of Landscape) */}
        <path
          d="M335 120 C340 100 355 90 370 95 C385 85 405 100 400 120 C410 135 415 155 405 175 C395 190 375 205 355 200 C340 195 330 180 325 160 C320 140 330 130 335 120 Z"
          fill="#1E7E34"
          stroke="#ffffff"
          strokeWidth="3"
        />
      </g>

      {/* Main Red Ribbon for "Jashpur" with 3D slope */}
      <g filter="url(#ribbonShadow)">
        {/* Red Banner Background */}
        <path
          d="M50 205 L415 200 C425 200 430 208 428 218 L410 285 C408 293 400 300 390 300 L60 305 C48 305 40 295 42 283 L50 205 Z"
          fill="url(#redRibbonGrad)"
        />
        {/* White Border Accent on Ribbon */}
        <path
          d="M55 210 L410 206 C418 206 422 212 420 220 L405 280 C403 286 397 292 388 292 L65 296 C56 296 50 288 52 278 Z"
          stroke="#ffffff"
          strokeWidth="2.5"
          fill="none"
          opacity="0.8"
        />

        {/* Text: "Jashpur" in Bold Clean Condensed Typeface */}
        <text
          x="75"
          y="278"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="88"
          letterSpacing="-1"
          style={{ textShadow: '2px 4px 6px rgba(0,0,0,0.3)' }}
        >
          Jashpur
        </text>
      </g>

      {/* Secondary Dark Navy / Black Banner for "• news" */}
      <g filter="url(#ribbonShadow)">
        <path
          d="M85 305 L395 300 C405 300 412 308 410 318 L395 365 C393 375 385 382 375 382 L100 385 C90 385 82 377 84 367 L85 305 Z"
          fill="#111827"
        />

        {/* Live Red Dot */}
        <circle cx="132" cy="345" r="14" fill="#C71920" />

        {/* Text: "news" in bold white */}
        <text
          x="158"
          y="364"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="66"
          letterSpacing="-0.5"
        >
          news
        </text>

        {/* Red Accent Speed Stripes on Right of news */}
        <rect x="382" y="315" width="8" height="50" fill="#C71920" transform="skewX(-15)" />
        <rect x="396" y="315" width="8" height="50" fill="#C71920" transform="skewX(-15)" />
      </g>

      {/* News Reporter Microphone on Right */}
      <g filter="url(#ribbonShadow)" transform="translate(10, 5)">
        {/* Mic Wire / Handle */}
        <path d="M410 250 L435 300 L420 305 L395 255 Z" fill="#182230" />

        {/* Red Mic Cube ("NEWS") */}
        <polygon points="395,210 435,210 445,260 405,260" fill="#C71920" stroke="#ffffff" strokeWidth="2" />
        <text
          x="420"
          y="245"
          fill="#ffffff"
          fontSize="15"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
          transform="rotate(6, 420, 240)"
        >
          NEWS
        </text>

        {/* Mic Capsule / Mesh */}
        <path
          d="M400 185 C395 160 415 140 435 145 C450 150 460 170 450 190 C445 205 435 210 420 210 C410 210 402 200 400 185 Z"
          fill="url(#micMetal)"
          stroke="#4B5563"
          strokeWidth="3"
        />
        {/* Mesh Grill Lines */}
        <line x1="410" y1="160" x2="440" y2="175" stroke="#9CA3AF" strokeWidth="2" />
        <line x1="405" y1="175" x2="445" y2="190" stroke="#9CA3AF" strokeWidth="2" />
        <line x1="420" y1="150" x2="435" y2="205" stroke="#9CA3AF" strokeWidth="2" />
      </g>

      {/* Bottom Slogan Text: "जशपुर की हर खबर, सबसे पहले" */}
      <g>
        <text
          x="250"
          y="418"
          fill="#182230"
          fontFamily="'Mukta', 'Noto Serif Devanagari', sans-serif"
          fontWeight="800"
          fontSize="30"
          textAnchor="middle"
        >
          जशपुर की हर खबर, सबसे पहले
        </text>

        {/* Red Arched Underline beneath Slogan */}
        <path
          d="M160 435 Q250 448 340 435"
          stroke="#C71920"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
