import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindcssDottedBackground from 'tailwindcss-dotted-background';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {

    fontFamily: {
      "sans": ['"Inter"', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        white: "white",
        primary: {
          DEFAULT: "#000630",
          light: "#8F8F8F",
        },
        secondary: {
          DEFAULT: "#2844DE",
          light: "#5369E5",
        },
        background: {
          DEFAULT: "#F9F9F9",
          dark: "#EFEFEF",
          secondary: "#E9ECFC",
        },
        success: {
          DEFAULT: "#17CC35"
        },
        warning: {
          DEFAULT: "#FF9900",
          light: "#FFF3E2",
        }
      }
    },
  },
  plugins: [tailwindcssDottedBackground],
};
export default config;
