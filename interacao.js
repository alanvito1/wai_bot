const { processarSimulacao } = require("./simulacao");
const { processarPergunta } = require("./ia");
const { sendMessage } = require("./utils");
const { registrarMensagem } = require("./backend/routes/stats");
const { buscarConhecimento } = require("./backend/database");

const userSteps = {};
const mensagensRepetidas = {};

const gatilhosSimulacao = [
  "iniciar simulação", "fazer uma simulação", "quero simular",
  "quero um consórcio", "como faço para comprar uma carta", "sim"
];

const termosMensagemAutomatica = [
  "bem-vindo", "escolha uma opção", "não entendi",
  "horário de atendimento", "digite apenas o número",
  "menu inicial", "para seguir preciso", "setor desejado"
];

const gerarCumprimento = () => {
  const hora = new Date().getHours();
  return hora < 12 ? "Bom dia!" : hora < 18 ? "Boa tarde!" : "Boa noite!";
};

const mensagemAutomaticaOuRepetida = (userId, mensagem) => {
  if (termosMensagemAutomatica.some(termo => mensagem.includes(termo))) {
    console.log("🔄 Mensagem automática identificada, ignorando.");
    return true;
  }

  if (!mensagensRepetidas[userId]) {
    mensagensRepetidas[userId] = { ultimaMensagem: mensagem, contador: 1 };
  } else if (mensagensRepetidas[userId].ultimaMensagem === mensagem) {
    mensagensRepetidas[userId].contador += 1;
    if (mensagensRepetidas[userId].contador > 2) {
      console.log("🚫 Limite de mensagens repetidas atingido, ignorando.");
      return true;
    }
  } else {
    mensagensRepetidas[userId] = { ultimaMensagem: mensagem, contador: 1 };
  }

  return false;
};

const processarMensagem = async (message) => {
  const userId = message.from;
  const userMessage = message.body ? message.body.trim().toLowerCase() : "";

  if (message.fromMe || message.isStatus || !userMessage) {
    console.log("🚫 Mensagem inválida ou vazia, ignorando.");
    return;
  }

  if (mensagemAutomaticaOuRepetida(userId, userMessage)) return;

  console.log(`📩 Mensagem recebida de ${userId}: ${userMessage}`);
  registrarMensagem(userId, userMessage, "recebida");

  if (!userSteps[userId]) {
    userSteps[userId] = { etapa: null };
  }

  if (message.hasMedia && message.type === "ptt") {
    await sendMessage(userId, "Ainda não aprendi a ouvir áudios, mas sou craque em ler mensagens! Escreve aí que eu te respondo rapidinho!");
    return;
  }

  if (userSteps[userId].etapa && userSteps[userId].etapa.startsWith("simulacao")) {
    return await processarSimulacao(userId, userMessage);
  }

  if (gatilhosSimulacao.some(trigger => userMessage.includes(trigger))) {
    userSteps[userId].etapa = "simulacao_inicio";
    return await processarSimulacao(userId, userMessage);
  }

  switch (userSteps[userId].etapa) {
    case "confirmar_saida":
      if (userMessage.includes("1")) {
        await sendMessage(userId, "Sem problemas! Se precisar, estarei por aqui. Até logo!");
        delete userSteps[userId];
      } else if (userMessage.includes("2")) {
        delete userSteps[userId];
        await processarMensagem({ from: userId, body: "" });
      } else {
        await sendMessage(userId, "Escolha uma opção válida:\n1️⃣ Encerrar atendimento\n2️⃣ Voltar ao menu inicial");
      }
      return;

    case "menu_principal":
      if (userMessage.includes("1")) {
        userSteps[userId].etapa = "simulacao_inicio";
        await processarSimulacao(userId, userMessage);
      } else if (userMessage.includes("2")) {
        userSteps[userId].etapa = "duvidas";
        await sendMessage(userId, "Ótima escolha! Me envia sua dúvida e eu te respondo!");
      } else if (userMessage.includes("3")) {
        await sendMessage(userId, "Entendido! Se precisar de mim, estarei por aqui. Até mais!");
        delete userSteps[userId];
      } else {
        await sendMessage(userId, "Por favor, escolha uma opção válida:\n1️⃣ Fazer Simulação\n2️⃣ Saber mais informações\n3️⃣ Sair");
      }
      return;

    case "pos_simulacao":
      if (gatilhosSimulacao.some(trigger => userMessage.includes(trigger))) {
        userSteps[userId].etapa = "simulacao_inicio";
        return await processarSimulacao(userId, userMessage);
      }

      if (["sair", "cancelar"].includes(userMessage)) {
        userSteps[userId].etapa = "confirmar_saida";
        await sendMessage(userId, "Você quer encerrar o atendimento ou voltar ao menu inicial?\n\n1️⃣ Encerrar atendimento\n2️⃣ Voltar ao menu inicial");
        return;
      }

      const respostaIAposSimulacao = await processarPergunta(userMessage);
      await sendMessage(userId, respostaIAposSimulacao || "Vou registrar sua dúvida para nosso consultor entrar em contato em breve. 😊");
      return;

    case "duvidas":
      const respostaIA = await processarPergunta(userMessage);
      await sendMessage(userId, respostaIA || "Sou especialista em consórcios! Quer ajuda para encontrar a melhor opção pra você?");
      return;

    default:
      if (["sair", "cancelar"].includes(userMessage)) {
        userSteps[userId].etapa = "confirmar_saida";
        await sendMessage(userId, "Você quer encerrar o atendimento ou voltar ao menu inicial?\n\n1️⃣ Encerrar atendimento\n2️⃣ Voltar ao menu inicial");
      } else {
        await sendMessage(userId, 
          `${gerarCumprimento()} Sou o Assistente Virtual do Alan. Como posso te ajudar hoje?\n\n` +
          "📌 Escolha uma opção:\n1️⃣ Fazer Simulação\n2️⃣ Saber mais informações\n3️⃣ Sair\n\nResponda com o número da opção."
        );
        userSteps[userId].etapa = "menu_principal";
      }
  }
};

module.exports = { processarMensagem, userSteps };