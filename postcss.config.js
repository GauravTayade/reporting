const {join} = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      configFile: join(__dirname,'./tailwind.config.js'),
    },
    autoprefixer: {},
  },
}
