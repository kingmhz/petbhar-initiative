import React from 'react';

export function InstagramIcon({ 
  size = 20, 
  className = '', 
  variant = 'colored' 
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

export function WhatsAppIcon({ 
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
      viewBox="0 0 175.216 175.552" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="pb-wa-grad" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#25D366" />
          <stop offset="1" stopColor="#128C7E" />
        </linearGradient>
      </defs>
      <path fill="#25D366" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z" />
      <path fill="url(#pb-wa-grad)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z" />
      <path fill="#ffffff" fillRule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647" />
    </svg>
  );
}

export function GooglePayIcon({ 
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
      viewBox="0 0 24 24" 
      className={`inline-block shrink-0 ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}


