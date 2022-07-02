module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          light: '#ff4db8',
          medium: '#FF0099',
          dark: '#b3006b',
        },
        purple: {
          light: '#bf4fc8',
          medium: '#A403B0',
          dark: '#73027b',
        },
        blue: {
          light: '#bfe8fa',
          medium: '#A4DEF8',
          dark: '#739bae',
        },
        red: {
          light: '#bd7076',
          medium: '#A1333B',
          dark: '#712429',
        },
        orange: {
          light: '#e1aa63',
          medium: '#D48520',
          dark: '#945d16',
        },
        smoke: {
          light: '#616e77',
          medium: '#1D303C',
          dark: '#14222a',
        },
        backdrop: 'rgba(0, 0, 0, 0.6)',
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
