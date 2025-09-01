// Production-ready Tailwind configuration
window.TAILWIND_PRODUCTION_CONFIG = {
  mode: 'jit', // Just-in-Time mode for better performance
  theme: {
    extend: {
      colors: {
        'prime-blue': '#1e40af',
        'prime-indigo': '#4338ca',
        'prime-purple': '#7c3aed',
        'prime-cyan': '#0891b2',
        'surface': '#0f172a',
        'surface-light': '#1e293b',
        'surface-lighter': '#334155',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'typing': 'typing 2s steps(20) infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled']
    }
  },
  purge: {
    enabled: true,
    content: [
      './src/**/*.js',
      './index.html'
    ]
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.glass-panel': {
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        },
        '.glass-elevated': {
          background: 'rgba(51, 65, 85, 0.9)',
          backdropFilter: 'blur(16px)', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }
      })
    }
  ]
};

// Apply production configuration if available
if (typeof tailwind !== 'undefined') {
  tailwind.config = window.TAILWIND_PRODUCTION_CONFIG;
}
