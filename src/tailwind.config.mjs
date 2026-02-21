/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.01em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '0.01em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.01em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '0.01em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '0.01em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1.0', letterSpacing: '0.01em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1.0', letterSpacing: '0.01em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "cormorantgaramond",
                paragraph: "sora"
            },
            colors: {
                'soft-gray-section': '#F8F8F8',
                'muted-accent': '#C0B29F',
                destructive: '#E57373',
                'destructive-foreground': '#FFFFFF',
                'status-available': '#81C784',
                'status-in-shop': '#FFB74D',
                'status-on-trip': '#64B5F6',
                'status-suspended': '#E0E0E0',
                background: '#FFFFFF',
                secondary: '#4A4A4A',
                foreground: '#333333',
                'secondary-foreground': '#FFFFFF',
                'primary-foreground': '#FFFFFF',
                primary: '#A08C70'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
