# WAIBOT - WhatsApp AI Gateway

Um bot de WhatsApp inteligente que utiliza a API DeepSeek para gerenciar interações e direcionar para simulações.

## 🚀 Como Iniciar

1. **Instalar dependências**:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` na raiz com sua chave da API DeepSeek:
   ```
   DEEPSEEK_API_KEY=sua_chave_aqui
   ```

3. **Iniciar a aplicação**:
   ```bash
   npm start
   ```

4. **Conectar o WhatsApp**:
   Ao iniciar, um QR Code será exibido no terminal. Escaneie-o com seu celular.

## 📁 Estrutura do Projeto

- `index.js`: Ponto de entrada do bot.
- `bot.js`: Configuração do cliente WhatsApp.
- `backend/`: API e servidor de banco de dados (SQLite).
- `frontend/`: Interface administrativa.
- `interacao.js`, `simulacao.js`, `ia.js`: Lógica de processamento de mensagens e integração com IA.

## 🛠️ Tecnologias

- Node.js
- whatsapp-web.js
- OpenAI API (DeepSeek)
- Express
- SQLite
- React (Frontend)
