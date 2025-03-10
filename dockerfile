# Etapa de build do frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Copia os arquivos de depend�ncias e instala
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copia o restante dos arquivos do projeto
COPY . .

# Executa o build do projeto (Vite gera a pasta "dist")
RUN npm run build

# Verifica se a pasta "dist" foi gerada
RUN ls -la /app/dist

# Etapa final: Nginx para servir o frontend
FROM nginx:alpine

# Copia os arquivos gerados na etapa de build para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exp�e a porta 80 (porta padr�o do Nginx)
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]