import daisyui from "daisyui"
import tailwindcss from "tailwindcss"
import themes from 'daisyui/src/theming/themes'
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {}
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...themes.light,
                    "primary": '#77b6ba',
                    "primary-content": '#f3f4f6',
                },
                dark: {
                    ...themes.dark,
                    "primary": '#77b6ba',
                    "primary-content": '#f3f4f6',
                },
            },
        ],

    },
    plugins: [tailwindcss, daisyui],
}

