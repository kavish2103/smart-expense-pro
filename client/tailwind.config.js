/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#646cff", // Example, tweak as needed
                secondary: "#535bf2",
            }
        },
    },
    plugins: [],
}
