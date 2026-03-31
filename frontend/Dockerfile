FROM node:20

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código do frontend
COPY . .

# Expor a porta 3000
EXPOSE 3000

ENV CI=true

# Comando para rodar o frontend em modo desenvolvimento
CMD ["npm", "start"]
