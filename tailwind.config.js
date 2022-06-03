module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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
        overlay: 'rgba(0, 0, 0, 0.5)',
      },

      fontSize: {
        xxs: '0.6rem',
      },

      spacing: {
        15: '3.75rem',
        42: '10.5rem',
        49: '12.25rem',
        68: '17rem',
        88: '22rem',
        100: '25rem',
        230: '57.5rem',
      },

      height: {
        'fit-content': 'fit-content',
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

      minHeight: {
        84: '21rem',
        100: '25rem',
        150: '37.5rem',
      },

      maxHeight: {
        'modal-content': 'calc(100vh - 0.5rem)',
      },
    },
  },
  plugins: [],
}
