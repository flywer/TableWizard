import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    transformerVariantGroup,
    transformerDirectives,
} from 'unocss'

import presetAutoprefixer from './src/render/presets/autoprefixer'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
    transformers: [transformerDirectives(), transformerVariantGroup()],
    presets: [
        presetAttributify(),
        presetIcons({
            autoInstall: true
        }),
        presetRemToPx(),
        presetUno(),
        presetTypography(),
        presetAutoprefixer()
    ]
})
