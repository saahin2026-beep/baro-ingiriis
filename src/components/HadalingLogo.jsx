export default function HadalingLogo({ size = 60, variant = 'color' }) {
  if (variant === 'mono') {
    return (
      <svg width={size} height={size * 0.83} viewBox="0 0 130 108" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 15 Q0 0 15 0 L115 0 Q130 0 130 15 L130 72 Q130 87 115 87 L42 87 L21 108 L26 87 L15 87 Q0 87 0 72 Z" fill="currentColor"/>
        <text x="65" y="62" fontFamily="Nunito, sans-serif" fontSize="52" fontWeight="900" fill="white" textAnchor="middle">H</text>
        <circle cx="115" cy="15" r="12" fill="currentColor"/>
      </svg>
    );
  }

  return (
    <svg width={size} height={size * 0.83} viewBox="0 0 130 108" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hadaling-cyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE"/>
          <stop offset="100%" stopColor="#0891B2"/>
        </linearGradient>
        <linearGradient id="hadaling-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBBF24"/>
          <stop offset="100%" stopColor="#F59E0B"/>
        </linearGradient>
      </defs>
      <path d="M0 15 Q0 0 15 0 L115 0 Q130 0 130 15 L130 72 Q130 87 115 87 L42 87 L21 108 L26 87 L15 87 Q0 87 0 72 Z" fill="url(#hadaling-cyan)"/>
      <text x="65" y="62" fontFamily="Nunito, sans-serif" fontSize="52" fontWeight="900" fill="white" textAnchor="middle">H</text>
      <circle cx="115" cy="15" r="12" fill="url(#hadaling-gold)"/>
    </svg>
  );
}
