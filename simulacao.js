const { sendMessage } = require("./utils");
const config = require("./config");

let userSteps = {};

const tiposConsorcio = {
    "🏡 Comprar Imóvel": "🏡 Imóvel",
    "🚗 Trocar ou comprar um veículo": "🚗 Veículo",
    "💰 Investir e lucrar": "💰 Investimento",
    "🚜 Agrícolas e Caminhões": "🚜 Negócios",
    "⚙ Fazer uma reforma ou ampliar sua empresa": "⚙ Reformas",
    "✈ Fazer uma grande viagem": "✈ Viagem"
};

function formatarNome(nome) {
    return nome
        .toLowerCase()
        .split(" ")
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(" ");
}

async function processarSimulacao(userId, userMessage) {
    if (!userSteps[userId]) {
        userSteps[userId] = { 
            etapa: "introducao", 
            telefone: userId
        };
    }

    const user = userSteps[userId];
    const msg = userMessage.trim().toLowerCase();

    // Permite que o usuário saia da simulação a qualquer momento
    if (["sair", "cancelar"].includes(msg)) {
        await sendMessage(userId, "Você saiu da simulação! Se precisar, estou à disposição. 😊");
        delete userSteps[userId];
        return;
    }

    switch (user.etapa) {
        case "introducao":
            await sendMessage(userId, "Antes de começar, qual é o seu *nome*?");
            user.etapa = "confirmar_nome";
            break;

        case "confirmar_nome":
            user.nome = formatarNome(userMessage);
            let opcoes = `Certo, ${user.nome}! O que você quer conquistar? 🚀\n\n`;
            Object.keys(tiposConsorcio).forEach((tipo, index) => {
                opcoes += `${index + 1}️⃣ ${tipo}\n`;
            });

            await sendMessage(userId, opcoes);
            user.etapa = "tipo";
            break;

        case "tipo":
            const tipoIndex = parseInt(userMessage) - 1;
            const tipoChave = Object.keys(tiposConsorcio)[tipoIndex];

            if (!tipoChave) {
                await sendMessage(userId, "❌ Escolha um número válido! 😉");
                return;
            }

            user.tipo = tipoChave;
            await sendMessage(userId, `Ótima escolha, ${user.nome}! Qual valor confortável você pode investir por mês? 💰 (Digite só o número, ex: 1500)`);
            user.etapa = "parcela";
            break;

        case "parcela":
            if (!/^\d+$/.test(userMessage)) {
                await sendMessage(userId, "❌ Digite um valor válido (ex: 1500).");
                return;
            }

            user.parcela = userMessage;
            await sendMessage(userId, `Perfeito! Qual o valor total que você quer? 💳 (Exemplo: 200000)`);
            user.etapa = "valor_total";
            break;

        case "valor_total":
            if (!/^\d+$/.test(userMessage)) {
                await sendMessage(userId, "❌ Preciso de um número válido! Digite um valor (ex: 200000).");
                return;
            }

            user.valor = userMessage;
            await sendMessage(userId, "Em quantos meses você quer realizar essa conquista? ⏳ (Exemplo: 10 meses)");
            user.etapa = "prazo";
            break;

        case "prazo":
            if (!/^\d+$/.test(userMessage)) {
                await sendMessage(userId, "❌ Informe um prazo válido em meses (ex: 10).");
                return;
            }

            user.prazo = userMessage;
            await sendMessage(userId, "Quer antecipar sua contemplação? 🚀 Você pensa em dar um lance?\n\n" +
                "1️⃣ Sim, tenho um valor guardado\n" +
                "2️⃣ Talvez, dependendo da oportunidade\n" +
                "3️⃣ Não, quero pagar as parcelas"
            );
            user.etapa = "lance";
            break;

            case "lance":
                user.lance = userMessage;
            
                const opcoesLance = {
                    "1": "Sim, tenho um valor guardado",
                    "2": "Talvez, dependendo da oportunidade",
                    "3": "Não, quero apenas pagar as parcelas"
                };
            
                const lanceTexto = opcoesLance[user.lance] || "Não informado";
            
                const adminId = config.adminNumber;
                await sendMessage(adminId, 
                    `📌 *Novo Lead Capturado!*\n\n👤 Nome: ${user.nome}\n📞 Telefone: ${user.telefone}\n🏦 Tipo de Consórcio: ${user.tipo}\n💰 Parcela: R$${user.parcela}\n💳 Valor total: R$${user.valor}\n⏳ Prazo: ${user.prazo} meses\n💵 Lance: ${lanceTexto}`
                );
            
                await sendMessage(userId, 
                    `Obrigado, ${user.nome}! Um consultor entrará em contato para te apresentar as melhores oportunidades.\n\n` +
                    "Caso tenha dúvidas ou queira adicionar algo à sua simulação, basta responder aqui. 😊"
                );
                
                userSteps[userId].etapa = "pos_simulacao"; // ⚠️ Estado pós-simulação
                break;
            

        default:
            user.etapa = null;
            break;
    }
}

module.exports = { processarSimulacao, userSteps };