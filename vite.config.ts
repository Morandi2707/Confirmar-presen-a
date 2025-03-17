import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'public', // Define dist/assets como diretório de origem (não recomendado)
  plugins: [react()],
  build: {
    outDir: '../' // Define onde os arquivos compilados serão gerados
  }
});
