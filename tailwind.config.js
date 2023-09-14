/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

//const plugin = require('tailwindcss/plugin')
// const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  
  // theme: {
  //   colors: {
  //     transparent: 'transparent',
  //     current: 'currentColor',
  //     black: colors.black,
  //     white: colors.white,
  //     gray: colors.gray,
  //     emerald: colors.emerald,
  //     indigo: colors.indigo,
  //     yellow: colors.yellow,
  //   },
  // },
  plugins: [],
}
