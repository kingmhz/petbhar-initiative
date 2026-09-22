import React from 'react';

export function InstagramIcon({ 
  size = 20, 
  className = '', 
  variant = 'adaptive' 
}: { 
  size?: number; 
  className?: string; 
  variant?: 'adaptive' | 'colored';
}) {
  const isColored = variant === 'colored';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ig-icon inline-block shrink-0 ${isColored ? 'ig-always-colored' : ''} ${className}`}
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        {/* Official Instagram Sunset Radial Gradient: 100% Saturation, Ultra-Bright & Vivid */}
        <radialGradient
          id="ig-brand-gradient"
          cx="20%"
          cy="110%"
          r="120%"
          fx="10%"
          fy="110%"
        >
          <stop offset="0%" stopColor="#FFD600" />
          <stop offset="20%" stopColor="#FF543E" />
          <stop offset="45%" stopColor="#FF0069" />
          <stop offset="70%" stopColor="#D300C5" />
          <stop offset="100%" stopColor="#7638FA" />
        </radialGradient>
      </defs>

      {/* Layer 1: Circular Gradient Background (Active on hover or when variant='colored') */}
      <circle 
        cx="12" 
        cy="12" 
        r="11.5" 
        fill="url(#ig-brand-gradient)" 
        className="ig-circle-bg transition-opacity duration-300" 
      />

      {/* Layer 2: Subtle Circular Outline (Active in idle state for clean circular boundary) */}
      <circle 
        cx="12" 
        cy="12" 
        r="11.5" 
        stroke="currentColor" 
        strokeWidth="1.4" 
        fill="none" 
        className="ig-circle-border transition-opacity duration-300" 
      />

      {/* Layer 3: Official Authentic Instagram Logo Vector Path */}
      <path
        className="ig-glyph-path transition-all duration-300"
        transform="translate(5.04, 5.04) scale(0.58)"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 1.166.052 1.802.235 2.224.402.558.217.956.477 1.374.896.419.418.679.815.896 1.374.167.422.35 1.058.402 2.224.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.052 1.166-.235 1.802-.402 2.224-.217.558-.477.956-.896 1.374-.418.419-.815.679-1.374.896-.422.167-1.058.35-2.224.402-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.166-.052-1.802-.235-2.224-.402-.558-.217-.956-.477-1.374-.896-.419-.418-.679-.815-.896-1.374-.167-.422-.35-1.058-.402-2.224-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.052-1.166.235-1.802.402-2.224.217-.558.477-.956.896-1.374.418-.419.815-.679 1.374-.896.422-.167 1.058-.35 2.224-.402 1.266-.058 1.646-.07 4.85-.07m0 -2.163c-3.259 0-3.667.014-4.947.072-1.277.058-2.15.258-2.913.557-.79.306-1.458.718-2.11 1.37-.652.652-1.064 1.32-1.37 2.11-.299.763-.499 1.636-.557 2.913-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.277.258 2.15.557 2.913.306.79.718 1.458 1.37 2.11.652.652 1.32 1.064 2.11 1.37.763.299 1.636.499 2.913.557 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.058 2.15-.258 2.913-.557.79-.306 1.458-.718 2.11-1.37.652-.652 1.064-1.32 1.37-2.11.299-.763.499-1.636.557-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.277-.258-2.15-.557-2.913-.306-.79-.718-1.458-1.37-2.11-.652-.652-1.32-1.064-2.11-1.37-.763-.299-1.636-.499-2.913-.557-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.997 3.999 3.999 0 0 1 0 7.997zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
      />
    </svg>
  );
}

export function YoutubeIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GmailIcon({ 
  size = 20, 
  className = '' 
}: { 
  size?: number; 
  className?: string; 
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="52 42 88 66" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
    >
      <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
      <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
      <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
      <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
      <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
    </svg>
  );
}

