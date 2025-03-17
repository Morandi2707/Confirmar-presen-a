import { defineConfig } from 'vite';

export default defineConfig({
  root: './',  // Certifique-se de que o Vite saiba onde procurar o index.html
  build: {
    outDir: 'dist',  // Saída para a pasta dist
  },
  publicDir: 'public',  // Diretório público
});
