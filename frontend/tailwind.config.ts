import type { Config } from 'tailwindcss'
 

export default {
  content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./node_modules/react-big-calendar/lib/css/react-big-calendar.css",
    
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
 
  theme: {
    extend: {
      colors: {
        canvasRed: '#7B1C1C',
        canvasRedHover: '#8e2c2c',
        canvasBg: '#f9fbfc',
      }
    }
  }
} satisfies Config


