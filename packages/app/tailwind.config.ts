import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    colors: {
      white: "white",
      primary: {
        DEFAULT: "#000630",
        // dark: '#000630',
        light: "#8F8F8F",
      },
      secondary: {
        DEFAULT: "#2844DE",
        light: "#5369E5",
      },
      background: {
        DEFAULT: "#F9F9F9",
        dark: "#EFEFEF"
      }
    },
    fontFamily: {
      "sans": ['"Inter"', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
