module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#E8F6FD',
          light: '#A4DEF8',
          medium: '#327B9B',
          dark: '#34657A',
        },
        dark__primary: {
          lightest: '#E8F6FD',
          light: '#A4DEF8',
          medium: '#327B9B',
          dark: '#34657A',
        },
        secondary: {
          lightest: '#E8F6FD',
          light: '#A4DEF8',
          medium: '#327B9B',
          dark: '#34657A',
        },
        dark__secondary: {
          lightest: '#E8F6FD',
          light: '#A4DEF8',
          medium: '#327B9B',
          dark: '#34657A',
        },
        backdrop: 'rgba(0, 0, 0, 0.6)',
        dark__backdrop: 'rgba(0, 0, 0, 0.6)',
      },

      spacing: {
        42: '10.5rem',
        49: '12.25rem',
        68: '17rem',
      },

      minWidth: {
        42: '10.5rem',
        100: '25rem',
      },

      maxWidth: {
        16: '4rem',
        42: '10.5rem',
        modal: 'calc(100vw - 1rem)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
