const flowbitePlugin = require('flowbite/plugin');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.js" // Use this path for Flowbite components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // Make sure this is the correct import for Flowbite
  ],
};
