module.exports = {
  purge: ["{app,pages}/**/*.{js,jsx,ts,tsx}"],
  theme: {},
  variants: {},
  plugins: [require("@tailwindcss/typography")],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
