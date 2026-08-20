import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#06040E',
          800: '#0C0818',
          700: '#140C24',
          600: '#1C1233',
        },
        paper: {
          DEFAULT: '#F3EEE4',
          100: '#FAF7F1',
          300: '#E7DFD0',
        },
        royal: {
          300: '#C4B5FD',
          400: '#8B5CF6',
          500: '#6D28D9',
          700: '#4C1D95',
        },
        volt: {
          300: '#93C5FD',
          400: '#3B82F6',
          500: '#1D4ED8',
        },
        ember: {
          300: '#FDBA74',
          400: '#FB923C',
          500: '#EA580C',
          600: '#C2410C',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        mist: {
          DEFAULT: '#D7D2E8',
          muted: '#9B93B3',
          faint: '#6E6688',
        },
        line: {
          DEFAULT: 'rgba(243,238,228,0.12)',
          strong: 'rgba(243,238,228,0.22)',
          paper: 'rgba(6,4,14,0.10)',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'hero-xl': ['clamp(3.6rem, 1.8rem + 9vw, 8.5rem)', { lineHeight: '0.88', letterSpacing: '-0.052em', fontWeight: '700' }],
        'display-xl': ['clamp(3.2rem, 1.5rem + 8vw, 7.5rem)', { lineHeight: '0.9', letterSpacing: '-0.048em' }],
        'display-lg': ['clamp(2.6rem, 1.3rem + 5vw, 5.4rem)', { lineHeight: '0.94', letterSpacing: '-0.042em' }],
        'display-md': ['clamp(2rem, 1.15rem + 3vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '-0.036em' }],
        'display-sm': ['clamp(1.65rem, 1.05rem + 1.6vw, 2.35rem)', { lineHeight: '1.08', letterSpacing: '-0.028em' }],
        'display-xs': ['clamp(1.3rem, 1rem + 1vw, 1.8rem)', { lineHeight: '1.12', letterSpacing: '-0.022em' }],
        lead: ['clamp(1.05rem, 0.95rem + 0.5vw, 1.25rem)', { lineHeight: '1.65', letterSpacing: '-0.01em' }],
        stat: ['clamp(2.75rem, 1.6rem + 3.5vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.045em' }],
        'stat-sm': ['clamp(1.75rem, 1.2rem + 1.5vw, 2.5rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
      },
      maxWidth: {
        shell: '80rem',
        prose: '62ch',
      },
      spacing: {
        section: 'clamp(5.5rem, 4rem + 8vw, 11rem)',
        'section-sm': 'clamp(3.5rem, 2.5rem + 4vw, 6.5rem)',
      },
      boxShadow: {
        ember: '0 18px 40px -18px rgba(234,88,12,0.55)',
        panel: '0 30px 80px -48px rgba(0,0,0,0.7)',
        lift: '0 24px 60px -32px rgba(109,40,217,0.35)',
        glow: '0 0 80px -20px rgba(139,92,246,0.45)',
        cinema: '0 40px 120px -40px rgba(0,0,0,0.85)',
        glass: '0 8px 32px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'a-gradient': 'linear-gradient(180deg, #6D28D9 0%, #1D4ED8 100%)',
        'ember-sweep': 'linear-gradient(110deg, #EA580C 0%, #F59E0B 55%, #EA580C 100%)',
        'royal-sweep': 'linear-gradient(135deg, #6D28D9 0%, #3B82F6 50%, #8B5CF6 100%)',
        'engine-glow':
          'radial-gradient(ellipse at 20% 0%, rgba(109,40,217,0.35), transparent 50%), radial-gradient(ellipse at 90% 20%, rgba(29,78,216,0.22), transparent 45%), radial-gradient(ellipse at 70% 90%, rgba(234,88,12,0.16), transparent 40%)',
        mesh:
          'radial-gradient(at 40% 20%, rgba(109,40,217,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(59,130,246,0.18) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(234,88,12,0.12) 0px, transparent 50%)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-x': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'pulse-dot': {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        flow: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        rise: {
          from: { transform: 'scaleY(0.2)', opacity: '0.4' },
          to: { transform: 'scaleY(1)', opacity: '1' },
        },
        spinGear: { to: { transform: 'rotate(360deg)' } },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-12deg)' },
          '100%': { transform: 'translateX(220%) skewX(-12deg)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(2%, -3%) scale(1.04)' },
          '66%': { transform: 'translate(-2%, 2%) scale(0.98)' },
        },
        'node-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(234,88,12,0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(234,88,12,0)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 36s linear infinite',
        'marquee-x': 'marquee-x 40s linear infinite',
        'marquee-x-reverse': 'marquee-x 44s linear infinite reverse',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        flow: 'flow 1.6s linear infinite',
        rise: 'rise 0.8s cubic-bezier(0.16,1,0.3,1) both',
        gear: 'spinGear 8s linear infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 0.75s ease forwards',
        aurora: 'aurora 14s ease-in-out infinite',
        'node-pulse': 'node-pulse 2.4s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
