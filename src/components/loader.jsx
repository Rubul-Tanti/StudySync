import React from 'react';

const Loader = ({ size = 'medium', variant = 'default' }) => {
  // Size configurations
  const sizeConfig = {
    xs: {
      container: 'p-1',
      svgSize: 16,
      innerSize: 8,
      innerRadius: 2,
      outerRadius: 6,
      strokeWidth: 2,
      dotSize: 'w-0.5 h-0.5',
      dotDistance: 8,
      rippleSize: 'w-4 h-4',
      rippleSize2: 'w-5 h-5',
      textSize: 'text-xs',
      spacing: 'ml-2'
    },
    small: {
      container: 'p-2',
      svgSize: 20,
      innerSize: 10,
      innerRadius: 3,
      outerRadius: 8,
      strokeWidth: 2,
      dotSize: 'w-0.5 h-0.5',
      dotDistance: 10,
      rippleSize: 'w-5 h-5',
      rippleSize2: 'w-6 h-6',
      textSize: 'text-xs',
      spacing: 'ml-2'
    },
    medium: {
      container: 'p-4',
      svgSize: 24,
      innerSize: 12,
      innerRadius: 3,
      outerRadius: 10,
      strokeWidth: 3,
      dotSize: 'w-1 h-1',
      dotDistance: 12,
      rippleSize: 'w-6 h-6',
      rippleSize2: 'w-8 h-8',
      textSize: 'text-sm',
      spacing: 'ml-3'
    },
    large: {
      container: 'p-8',
      svgSize: 80,
      innerSize: 40,
      innerRadius: 8,
      outerRadius: 35,
      strokeWidth: 6,
      dotSize: 'w-2 h-2',
      dotDistance: 25,
      rippleSize: 'w-16 h-16',
      rippleSize2: 'w-20 h-20',
      textSize: 'text-lg',
      spacing: 'ml-6'
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Button variant - minimal spinner only
  if (variant === 'button') {
    return (
      <div className="inline-flex items-center justify-center">
        <svg
          className="animate-spin"
          width={config.svgSize}
          height={config.svgSize}
          viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.outerRadius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * config.outerRadius * 0.75}`}
            strokeDashoffset={`${Math.PI * config.outerRadius * 0.25}`}
            className="opacity-25"
          />
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.outerRadius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * config.outerRadius * 0.25}`}
            strokeDashoffset={`${Math.PI * config.outerRadius * 0.75}`}
          />
        </svg>
      </div>
    );
  }

  // Spinner variant - clean rotating circle
  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${config.container}`}>
        <div className="relative">
          <svg
            className="animate-spin"
            width={config.svgSize}
            height={config.svgSize}
            viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx={config.svgSize / 2}
              cy={config.svgSize / 2}
              r={config.outerRadius}
              stroke="url(#gradient1)"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${Math.PI * config.outerRadius * 0.75}`}
              strokeDashoffset={`${Math.PI * config.outerRadius * 0.25}`}
              className="opacity-80"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  // Default variant - full featured loader
  return (
    <div className={`flex items-center justify-center ${config.container}`}>
      <div className="relative">
        {/* Outer rotating ring */}
        <svg
          className="animate-spin"
          width={config.svgSize}
          height={config.svgSize}
          viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.outerRadius}
            stroke="url(#gradient1)"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset="60"
            className="opacity-80"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            width={config.innerSize}
            height={config.innerSize}
            viewBox={`0 0 ${config.innerSize} ${config.innerSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx={config.innerSize / 2}
              cy={config.innerSize / 2}
              r={config.innerRadius}
              fill="url(#gradient2)"
              className="animate-pulse"
            />
            <defs>
              <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Floating dots - only show for medium+ sizes */}
        {(size === 'medium' || size === 'large') && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`absolute ${config.dotSize} [#005188] rounded-full animate-ping`}
                style={{
                  top: `${Math.sin((i * Math.PI) / 2) * config.dotDistance}px`,
                  left: `${Math.cos((i * Math.PI) / 2) * config.dotDistance}px`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.5s',
                }}
              />
            ))}
          </div>
        )}

        {/* Ripple effect - only for large sizes */}
        {size === 'large' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`${config.rippleSize} border-2 border-blue-300 rounded-full animate-ping opacity-30`}></div>
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${config.rippleSize2} border-2 border-[#005188] rounded-full animate-ping opacity-20`}
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>
        )}
      </div>

      {/* Loading text - only for default variant and medium+ sizes */}
      {variant === 'default' && (size === 'medium' || size === 'large') && (
        <div className={`${config.spacing} text-[#005188] font-semibold ${config.textSize}`}>
          <span className="inline-block animate-pulse">Loading</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.3s' }}>.</span>
        </div>
      )}
    </div>
  );
};

export default Loader;