import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import { postcss } from '@stencil/postcss'
import autoprefixer from 'autoprefixer'

export const config: Config = {
  namespace: 'design-system-components',
  globalStyle: 'src/styles/design-system-components.scss',
  plugins: [
    postcss({
      plugins: [autoprefixer()],
    }),
    sass(),
  ],
}