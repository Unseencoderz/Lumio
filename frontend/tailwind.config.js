/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Modern color palette
        bg: '#071028',
        surface: '#0F1724',
        elevated: '#111827',
        text: '#E6F1FB',
        muted: '#9AA6B2',
        border: '#1E2A3A',
        'accent-cyan': '#00D4FF',
        'accent-violet': '#7C5CFF',
        success: '#2DD4BF',
        warning: '#FFB020',
        error: '#FF6B6B',
        
        // Legacy support
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted-foreground))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(90deg, #00D4FF 0%, #7C5CFF 100%)',
        'accent-gradient-vertical': 'linear-gradient(180deg, #00D4FF 0%, #7C5CFF 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'pulse-glow': {
          '0%': { 
            transform: 'translateY(0)', 
            boxShadow: '0 8px 18px rgba(0, 212, 255, 0.06)' 
          },
          '50%': { 
            transform: 'translateY(-3px)', 
            boxShadow: '0 18px 48px rgba(0, 212, 255, 0.10)' 
          },
          '100%': { 
            transform: 'translateY(0)', 
            boxShadow: '0 8px 18px rgba(0, 212, 255, 0.06)' 
          },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(124, 92, 255, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(124, 92, 255, 0.3)' 
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2.6s infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      boxShadow: {
        'glow-cyan': '0 8px 30px rgba(0, 212, 255, 0.08), 0 2px 8px rgba(124, 92, 255, 0.06)',
        'glow-violet': '0 8px 30px rgba(124, 92, 255, 0.08), 0 2px 8px rgba(0, 212, 255, 0.06)',
        'glow-accent': '0 10px 28px rgba(0, 212, 255, 0.06), 0 4px 10px rgba(124, 92, 255, 0.04)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};