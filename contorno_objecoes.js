const axios = require('axios');
const config = require('./config');

async function processarPergunta(pergunta) {
    try {
        console.log(`🤖 IA recebendo pergunta: ${pergunta}`);

        const resposta = await axios.post('https://api.deepseek.com/ask', {
            question: pergunta
        }, {
            headers: { Authorization: `Bearer ${config.deepSeekApiKey}` }
        });

        console.log("🔍 Resposta da DeepSeek:", resposta.data); // Debug: Mostra a resposta recebida

        if (resposta.data && resposta.data.answer) {
            return resposta.data.answer;
        } else {
            return "Desculpe, não encontrei uma resposta para isso.";
        }
    } catch (error) {
        console.error("❌ Erro na consulta à IA:", error.response ? error.response.data : error.message);
        return "Houve um erro ao processar sua pergunta.";
    }
}

module.exports = { processarPergunta };
