FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas package.json e lockfile
COPY package.json pnpm-lock.yaml ./

# Instala dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Exponha a porta
EXPOSE 3000

# Comando de start
CMD ["pnpm", "start"]
