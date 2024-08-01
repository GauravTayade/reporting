/** @type {import('tailwindcss').Config} */
const {join} = require('path');

module.exports = {
  content: [
    join(__dirname,"./src/pages/**/*.{js,ts,jsx,tsx,mdx,html}"),
    join(__dirname,"./src/Components/**/*.{js,ts,jsx,tsx,mdx,html}"),
    join(__dirname,"./src/app/**/*.{js,ts,jsx,tsx,mdx,html}"),
  ],
  theme: {
    extend: {
      gridRow:{
        'span-7':'span 7/ span 7',
        'span-8':'span 8/ span 8',
        'span-9':'span 9/ span 9',
        'span-10':'span 10/ span 10',
        'span-11':'span 11/ span 11',
        'span-12':'span 12/ span 12',
        'span-13':'span 13/ span 13',
        'span-14':'span 14/ span 14',
        'span-15':'span 15/ span 15',
        'span-16':'span 16/ span 16',
        'span-17':'span 17/ span 17',
        'span-18':'span 18/ span 18',
      },
      gridColumn:{
        'span-13':'span 13/ span 13',
        'span-14':'span 14/ span 14',
        'span-15':'span 15/ span 15',
        'span-16':'span 16/ span 16',
        'span-17':'span 17/ span 17',
        'span-18':'span 18/ span 18',
      },
      gridTemplateRows:{
        '7':'repeat(7, minmax(0,1fr))',
        '8':'repeat(8, minmax(0,1fr))',
        '9':'repeat(9, minmax(0,1fr))',
        '10':'repeat(10, minmax(0,1fr))',
        '11':'repeat(11, minmax(0,1fr))',
        '12':'repeat(12, minmax(0,1fr))',
        '13':'repeat(13, minmax(0,1fr))',
        '14':'repeat(14, minmax(0,1fr))',
        '15':'repeat(15, minmax(0,1fr))',
        '16':'repeat(16, minmax(0,1fr))',
        '17':'repeat(17, minmax(0,1fr))',
        '18':'repeat(18, minmax(0,1fr))',
      },
      gridTemplateColumns:{
        '13':'repeat(13, minmax(0,1fr))',
        '14':'repeat(14, minmax(0,1fr))',
        '15':'repeat(15, minmax(0,1fr))',
        '16':'repeat(16, minmax(0,1fr))',
        '17':'repeat(17, minmax(0,1fr))',
        '18':'repeat(18, minmax(0,1fr))',
      },
      backgroundImage: {
        "logo":"url('/assets/images/logo_header_a2n.png')",
        "map":"url('/assets/images/map.png')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
