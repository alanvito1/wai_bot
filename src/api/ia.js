const OpenAI = require("openai");
const config = require("../../config");
const database = require("../../backend/database");

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: config.deepSeekApiKey
});

// 🔹 Palavras-chave que não devem ser processadas pela IA
const gatilhosInternos = [
    "iniciar simulação", 
    "fazer uma simulação", 
    "quero simular",
    "quero um consórcio",
    "como faço para comprar uma carta",
    "simular"
];

async function processarPergunta(pergunta) {
    console.log(`🤖 Pergunta recebida: ${pergunta}`);

    // 🔹 Normaliza a mensagem para facilitar a comparação
    const mensagemNormalizada = pergunta.toLowerCase();

    // 🔹 Se a mensagem contiver um gatilho interno, retorna resposta fixa sem chamar a IA
    if (gatilhosInternos.some(trigger => mensagemNormalizada.includes(trigger))) {
        return "Parece que você quer fazer uma simulação! Vou te ajudar agora. 🚀";
    }

    try {
        // 🔹 1️⃣ Verifica se a pergunta está cadastrada como objeção
        const respostaObjecao = await new Promise((resolve) => {
            database.buscarObjecao(pergunta, resolve);
        });

        if (respostaObjecao) {
            console.log("⚠️ Respondendo com base na objeção cadastrada.");
            return respostaObjecao;
        }

        // 🔹 2️⃣ Busca no banco de conhecimento
        const respostaLocal = await new Promise((resolve) => {
            database.buscarConhecimento(pergunta, resolve);
        });

        if (respostaLocal) {
            console.log("📚 Respondendo com base no banco de conhecimento.");
            return respostaLocal;
        }

        // 🔹 3️⃣ Se não encontrou no banco, consulta a IA
        console.log("🔍 Consultando IA...");
        const completion = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: config.iaPrompt },
                { role: "user", content: pergunta }
            ],
            max_tokens: 150,
            temperature: 0.7
        });

        const resposta = completion.choices[0]?.message?.content || "Desculpe, não encontrei uma resposta.";
        console.log("🔍 Resposta da IA:", resposta);
        return resposta;
    } catch (error) {
        console.error("❌ Erro na consulta à IA:", error.response ? error.response.data : error.message);
        return "Houve um erro ao processar sua pergunta.";
    }
}

module.exports = { processarPergunta };