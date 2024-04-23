const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(), // Use this path for Flowbite components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(), // Make sure this is the correct import for Flowbite
  ],
};
