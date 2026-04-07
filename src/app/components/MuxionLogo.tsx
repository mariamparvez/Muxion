import svgPaths from "../../imports/svg-3hnv8ad2m6";

interface MuxionLogoProps {
  className?: string;
  size?: number;
}

export function MuxionLogo({ className = "", size = 140 }: MuxionLogoProps) {
  const height = size * 0.33;
  
  return (
    <svg 
      width={size} 
      height={height}
      viewBox="0 0 1158.19 382.919" 
      fill="none" 
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        {/* M - First vertical and diagonal */}
        <path 
          d={svgPaths.p244b4c00} 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="36" 
        />
        {/* U - Curve */}
        <path 
          d={svgPaths.p31b9d900} 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeWidth="36" 
        />
        {/* X - Crossed lines */}
        <path 
          d={svgPaths.p39df9b00} 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeWidth="36" 
        />
        {/* I - Vertical line */}
        <path 
          d={svgPaths.pee33880} 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeWidth="36" 
        />
        {/* O - Circle */}
        <path 
          d={svgPaths.p3cbba080} 
          stroke="currentColor" 
          strokeWidth="36" 
        />
        {/* N - Second diagonal and vertical */}
        <path 
          d={svgPaths.p20d58900} 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="36" 
        />
      </g>
    </svg>
  );
}
