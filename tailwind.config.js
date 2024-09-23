/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
  	fontFamily: {
  		sans: ['Segoe UI', 'Roboto', 'sans-serif'],
  		mono: ['monospace']
  	},
  	extend: {
  		keyframes: {
  			hide: {
  				from: {
  					opacity: '1'
  				},
  				to: {
  					opacity: '0'
  				}
  			},
  			slideIn: {
  				from: {
  					transform: 'translateX(calc(100% + var(--viewport-padding)))'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			swipeOut: {
  				from: {
  					transform: 'translateX(var(--radix-toast-swipe-end-x))'
  				},
  				to: {
  					transform: 'translateX(calc(100% + var(--viewport-padding)))'
  				}
  			}
  		},
  		animation: {
  			hide: 'hide 100ms ease-in',
  			slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			swipeOut: 'swipeOut 100ms ease-out'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
