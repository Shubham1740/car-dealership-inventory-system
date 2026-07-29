/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: 'rgb(var(--color-bg) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                border: 'rgb(var(--color-border) / <alpha-value>)',
                ink: 'rgb(var(--color-ink) / <alpha-value>)',
                muted: 'rgb(var(--color-muted) / <alpha-value>)',
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
                'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
                danger: 'rgb(var(--color-danger) / <alpha-value>)',
            },
            fontFamily: {
                display: ['"Space Grotesk"', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
};