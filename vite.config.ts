import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
          'js-img-cropper/utils': resolve(import.meta.dirname, 'lib/utils.ts'),
          'js-img-cropper': resolve(import.meta.dirname, 'lib/index.ts'),
        },
      },
    build: {
        lib: {
            entry: {
                index: resolve(import.meta.dirname, 'lib/index.ts'),
                utils: resolve(import.meta.dirname, 'lib/utils.ts'),
            },
            formats: ['es', 'cjs'],
            name: 'JS Image Cropper',
        },
        copyPublicDir: false,
        rolldownOptions: {
            output: {},
        },
    },
})
