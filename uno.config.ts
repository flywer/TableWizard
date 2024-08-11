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

export default defineConfig({
    transformers: [transformerDirectives(), transformerVariantGroup()],
    presets: [
        presetAttributify(),
        presetIcons({
            autoInstall: true,
        }),
        presetUno(),
        presetTypography(),
        presetAutoprefixer(),
    ],
})
