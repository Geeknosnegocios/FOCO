import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withBubble?: boolean;
  bubbleText?: string;
  animated?: boolean;
}

export const NandoBananaMascot: React.FC<Props> = ({
  className = '',
  size = 'md',
  withBubble = false,
  bubbleText = 'Bora quebrar a inércia! 5-4-3-2-1 e AÇÃO!',
  animated = true,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {withBubble && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] px-3.5 py-1.5 rounded-2xl shadow-xl shadow-amber-500/25 border border-white/50 animate-bounce">
          <span>{bubbleText}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45" />
        </div>
      )}

      <div className={`relative ${sizeMap[size]} ${animated ? 'animate-pulse duration-1000' : ''}`}>
        <svg
          viewBox="0 0 240 260"
          className="w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Banana body gradient */}
            <linearGradient id="bananaBody" x1="40" y1="20" x2="200" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="30%" stop-color="#facc15" />
              <stop offset="75%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#ca8a04" />
            </linearGradient>

            {/* Banana tip */}
            <linearGradient id="bananaTip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#15803d" />
              <stop offset="100%" stop-color="#84cc16" />
            </linearGradient>

            {/* Glasses gradient */}
            <linearGradient id="visorGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#06b6d4" />
              <stop offset="50%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#8b5cf6" />
            </linearGradient>

            {/* Jetpack flame */}
            <linearGradient id="jetFlame" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="30%" stop-color="#fef08a" />
              <stop offset="70%" stop-color="#f97316" />
              <stop offset="100%" stop-color="#ef4444" />
            </linearGradient>

            {/* Jetpack Metal */}
            <linearGradient id="jetMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#64748b" />
              <stop offset="50%" stop-color="#334155" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>

            {/* Aura glow */}
            <filter id="bananaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Jetpack Rocket on Back */}
          <g>
            <rect x="36" y="90" width="30" height="70" rx="12" fill="url(#jetMetal)" stroke="#94a3b8" stroke-width="2.5" />
            <rect x="42" y="80" width="18" height="12" rx="5" fill="#e2e8f0" />
            {/* Jet nozzle */}
            <path d="M42 160 L60 160 L66 174 L36 174 Z" fill="#475569" stroke="#64748b" stroke-width="2" />
            {/* Thruster Flames */}
            <path
              d="M40 174 Q51 215 51 230 Q51 215 62 174 Z"
              fill="url(#jetFlame)"
              filter="url(#bananaGlow)"
            />
            <path
              d="M45 174 Q51 198 51 206 Q51 198 57 174 Z"
              fill="#ffffff"
            />
          </g>

          {/* Main Banana Curved Body */}
          <path
            d="M 125 24 C 115 28 85 55 75 105 C 65 155 80 200 135 228 C 175 248 205 235 212 215 C 218 198 200 190 175 180 C 145 168 135 140 135 105 C 135 70 148 40 132 25 Z"
            fill="url(#bananaBody)"
            stroke="#b45309"
            stroke-width="4.5"
            stroke-linejoin="round"
          />

          {/* Banana Stem Top (Green Tip) */}
          <path
            d="M 125 24 C 122 15 125 6 132 4 C 137 3 140 9 138 18 C 136 24 132 26 125 24 Z"
            fill="url(#bananaTip)"
            stroke="#166534"
            stroke-width="2.5"
          />

          {/* Banana Bottom Crown */}
          <path
            d="M 212 215 C 216 220 220 224 222 226 C 220 228 214 225 210 222 Z"
            fill="#78350f"
          />

          {/* High-Tech Cyber Visor / Sunglasses */}
          <g>
            <path
              d="M 85 92 Q 130 84 175 92 L 170 114 Q 130 110 88 116 Z"
              fill="url(#visorGlass)"
              stroke="#0f172a"
              stroke-width="3"
            />
            {/* Visor Glare Reflection */}
            <path
              d="M 95 95 L 125 93 L 115 110 L 89 112 Z"
              fill="#ffffff"
              fill-opacity="0.45"
            />
            {/* Glasses Frame strap */}
            <path d="M 85 96 L 76 98" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
            <path d="M 175 96 L 184 100" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
          </g>

          {/* Cheeky Confident Smile */}
          <path
            d="M 112 126 Q 132 144 156 128"
            stroke="#78350f"
            stroke-width="4.5"
            stroke-linecap="round"
            fill="none"
          />
          {/* Tongue / Open smile accent */}
          <path
            d="M 125 136 Q 134 146 144 136 Z"
            fill="#f43f5e"
          />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="98" cy="124" rx="7" ry="4" fill="#fb7185" fill-opacity="0.6" />
          <ellipse cx="164" cy="126" rx="7" ry="4" fill="#fb7185" fill-opacity="0.6" />

          {/* Hero Thumbs Up Left Hand / Arm */}
          <g>
            {/* Arm */}
            <path
              d="M 152 140 Q 185 142 196 125"
              stroke="#ca8a04"
              stroke-width="8"
              stroke-linecap="round"
              fill="none"
            />
            {/* White Hero Glove Hand with Thumbs Up */}
            <circle cx="196" cy="122" r="13" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" />
            {/* Thumb pointing up */}
            <path
              d="M 194 122 L 194 102 Q 198 98 202 102 L 202 120"
              fill="#ffffff"
              stroke="#0f172a"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </g>

          {/* Left Rest Arm */}
          <path
            d="M 94 140 Q 75 160 88 175"
            stroke="#ca8a04"
            stroke-width="7"
            stroke-linecap="round"
            fill="none"
          />
          <circle cx="90" cy="176" r="10" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" />

          {/* High-Tech Sneakers / Feet */}
          {/* Left Foot */}
          <g>
            <path
              d="M 108 222 L 108 238 L 84 245 Q 76 248 76 240 L 96 230 Z"
              fill="#6366f1"
              stroke="#0f172a"
              stroke-width="2.5"
            />
            <rect x="76" y="242" width="34" height="6" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
          </g>

          {/* Right Foot */}
          <g>
            <path
              d="M 156 226 L 160 242 L 186 247 Q 194 249 193 241 L 172 232 Z"
              fill="#6366f1"
              stroke="#0f172a"
              stroke-width="2.5"
            />
            <rect x="160" y="244" width="35" height="6" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
          </g>

          {/* Sparkles / Focus Energy Stars */}
          <path
            d="M 215 65 L 218 75 L 228 78 L 218 81 L 215 91 L 212 81 L 202 78 L 212 75 Z"
            fill="#facc15"
            filter="url(#bananaGlow)"
          />
          <circle cx="65" cy="55" r="4" fill="#38bdf8" />
          <circle cx="185" cy="40" r="3" fill="#ec4899" />
        </svg>
      </div>
    </div>
  );
};
