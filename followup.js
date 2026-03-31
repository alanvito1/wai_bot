const { sendMessage } = require('./utils');

const followUpTimers = {};

function iniciarFollowUp(userId) {
    if (followUpTimers[userId]) return;

    followUpTimers[userId] = setTimeout(async () => {
        await sendMessage(userId, "Alan, percebi que você pausou sua simulação. Está com alguma dúvida? 😊");

        setTimeout(async () => {
            await sendMessage(userId, "📌 Lembre-se: Cada mês que passa, você adia o seu sonho! Vamos resolver isso juntos? 🚀");

            setTimeout(async () => {
                await sendMessage(userId, "⚠️ Última oportunidade: Ainda podemos garantir condições especiais! Quer continuar sua simulação? 💡");
                delete followUpTimers[userId]; // Removendo timer após a última tentativa
            }, 2 * 60 * 60 * 1000);
        }, 2 * 60 * 60 * 1000);
    }, 30 * 60 * 1000);
}

module.exports = { iniciarFollowUp };
