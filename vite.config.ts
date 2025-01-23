import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import electron from "vite-plugin-electron"
import electronRenderer from "vite-plugin-electron-renderer"
import polyfillExport from "vite-plugin-electron-renderer"
import { server } from 'typescript'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        entry:"./electron-src/index.ts"
      },
      {
        entry:"./electron-src/preload.ts"
      },
      {
        entry:"./server/server.ts",
        vite:{
          build:{
            outDir:"dist-electron/server"
          }
        }
      },
      {
        entry:"./server/routes/bili.ts",
        vite:{
          build:{
            outDir:"dist-electron/server/routes"
          }
        }
      },
      {
        entry:"./server/routes/kuwo.ts",
        vite:{
          build:{
            outDir:"dist-electron/server/routes"
          }
        }
      },
      {
        entry:"./server/routes/cache.ts",
        vite:{
          build:{
            outDir:"dist-electron/server/routes"
          }
        }
      }
    ]),
    electronRenderer(),
    polyfillExport()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build:{
    emptyOutDir:false,
    outDir:"dist-electron",
  }
})
