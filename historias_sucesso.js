const historias = {
    "🏡 Sair do Aluguel": [
        "🏡 *História de Sucesso - João & Maria* 🏡\n\nJoão e Maria passaram anos pagando aluguel e achavam impossível comprar a casa própria. Foi quando descobriram o consórcio e, em poucos meses, foram contemplados! Hoje, vivem na casa dos sonhos sem pagar juros abusivos. E você, já pensou em sair do aluguel e investir no seu próprio imóvel? 😉"
    ],
    "🚘 Comprar ou trocar de veículo": [
        "🚗 *História de Sucesso - Carlos* 🚗\n\nCarlos queria trocar de carro, mas não queria pagar juros absurdos do financiamento. Ele optou pelo consórcio, foi contemplado e conseguiu um veículo novinho sem apertar o orçamento! Agora ele viaja tranquilo e sem dívidas. Que tal fazer o mesmo e conquistar seu carro dos sonhos? 🚀"
    ],
    "💰 Guardar dinheiro e vender a carta com Lucro": [
        "💰 *História de Sucesso - Mariana* 💰\n\nMariana sempre quis uma forma segura de guardar dinheiro e ainda lucrar. Ela investiu no consórcio, foi contemplada e vendeu sua carta por um valor acima do que pagou! Hoje, ela usa essa estratégia para aumentar seu patrimônio. Você também pode lucrar com essa oportunidade! Quer saber como? 😉"
    ],
    "🚜 Agricultor ou Caminhoneiro 🚛": [
        "🚜 *História de Sucesso - Seu Francisco* 🚛\n\nSeu Francisco trabalha no campo e precisava de um novo trator para aumentar sua produção. Com o consórcio, ele adquiriu a máquina sem pagar juros altos e agora sua colheita rende muito mais! O mesmo aconteceu com Pedro, caminhoneiro que comprou um caminhão novinho para aumentar seus ganhos! E você, pronto para crescer no seu trabalho? 🌱"
    ],
    "⚙ Serviços ou Reformas": [
        "🛠 *História de Sucesso - André* 🔨\n\nAndré é eletricista e queria expandir seu negócio, mas não tinha capital para investir. Ele usou o consórcio para comprar equipamentos e hoje atende mais clientes do que nunca! Com parcelas acessíveis, ele conseguiu crescer sem comprometer o fluxo de caixa. Já pensou em investir no seu negócio com essa estratégia? 😉"
    ],
    "✈ Viajar": [
        "✈ *História de Sucesso - Fernanda* ✈\n\nFernanda sempre sonhou em fazer um mochilão pela Europa, mas nunca conseguia juntar dinheiro. Foi então que optou pelo consórcio de viagens! Em pouco tempo, foi contemplada e realizou sua aventura sem se preocupar com dívidas. Agora, já está planejando a próxima viagem! E você, qual destino dos sonhos quer conhecer? 🌍✨"
    ]
};

// 🔹 Função para retornar uma história baseada no tipo de consórcio escolhido
function contarHistoria(tipoConsorcio) {
    if (historias.hasOwnProperty(tipoConsorcio)) {
        const historiasDisponiveis = historias[tipoConsorcio];
        return historiasDisponiveis[Math.floor(Math.random() * historiasDisponiveis.length)];
    } else {
        return "📖 *História de Sucesso*\n\nMuitas pessoas já realizaram seus sonhos com o consórcio! Você pode ser o próximo. Quer saber como começar? 🚀";
    }
}

module.exports = { contarHistoria };
