# Usa uma imagem que já vem com Node e Chrome instalados (economiza o tempo de build)
FROM ghcr.io/puppeteer/puppeteer:latest

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package.json ./
RUN npm install

# Copia o resto dos arquivos (seu index.js)
COPY . .

# Expõe a porta que o script usa
EXPOSE 3000

# Comando para iniciar
CMD ["node", "index.js"]
