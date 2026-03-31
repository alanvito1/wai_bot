import { useState, useEffect } from "react";

function KnowledgeBase() {
    const [conhecimentos, setConhecimentos] = useState([]);
    const [objecoes, setObjecoes] = useState([]);
    const [novaPergunta, setNovaPergunta] = useState("");
    const [novaResposta, setNovaResposta] = useState("");
    const [novaObjecao, setNovaObjecao] = useState("");
    const [respostaObjecao, setRespostaObjecao] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    function carregarDados() {
        fetch("http://localhost:5000/api/knowledge")
            .then(res => res.json())
            .then(data => setConhecimentos(data))
            .catch(err => console.error("Erro ao carregar conhecimento:", err));

        fetch("http://localhost:5000/api/objections")
            .then(res => res.json())
            .then(data => setObjecoes(data))
            .catch(err => console.error("Erro ao carregar objeções:", err));
    }

    function adicionarConhecimento() {
        if (!novaPergunta || !novaResposta) {
            setStatus("❌ Preencha ambos os campos!");
            return;
        }

        fetch("http://localhost:5000/api/knowledge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pergunta: novaPergunta, resposta: novaResposta })
        })
        .then(() => {
            setNovaPergunta("");
            setNovaResposta("");
            setStatus("✅ Conhecimento adicionado!");
            carregarDados(); // Atualiza a lista automaticamente
        })
        .catch(() => setStatus("❌ Erro ao adicionar conhecimento!"));
    }

    function adicionarObjecao() {
        if (!novaObjecao || !respostaObjecao) {
            setStatus("❌ Preencha ambos os campos!");
            return;
        }

        fetch("http://localhost:5000/api/objections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ objecao: novaObjecao, resposta: respostaObjecao })
        })
        .then(() => {
            setNovaObjecao("");
            setRespostaObjecao("");
            setStatus("✅ Objeção adicionada!");
            carregarDados(); // Atualiza a lista automaticamente
        })
        .catch(() => setStatus("❌ Erro ao adicionar objeção!"));
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📚 Banco de Conhecimento & Objeções</h2>

            {/* Seção de Adicionar Conhecimento */}
            <div className="mb-4">
                <h3 className="font-bold">Adicionar Novo Conhecimento</h3>
                <input type="text" placeholder="Pergunta" value={novaPergunta} onChange={e => setNovaPergunta(e.target.value)} className="border p-2 w-full mb-2" />
                <textarea placeholder="Resposta" value={novaResposta} onChange={e => setNovaResposta(e.target.value)} className="border p-2 w-full mb-2"></textarea>
                <button onClick={adicionarConhecimento} className="bg-blue-500 text-white px-4 py-2 rounded">➕ Adicionar</button>
            </div>

            {/* Seção de Adicionar Objeções */}
            <div className="mb-4">
                <h3 className="font-bold">➖ Adicionar Objeção</h3>
                <input type="text" placeholder="Objeção do Cliente" value={novaObjecao} onChange={e => setNovaObjecao(e.target.value)} className="border p-2 w-full mb-2" />
                <textarea placeholder="Resposta para Contornar" value={respostaObjecao} onChange={e => setRespostaObjecao(e.target.value)} className="border p-2 w-full mb-2"></textarea>
                <button onClick={adicionarObjecao} className="bg-red-500 text-white px-4 py-2 rounded">➕ Adicionar Objeção</button>
            </div>

            {status && <p className="mt-2 text-green-500">{status}</p>}

            {/* Listagem de Conhecimento */}
            <div className="mt-4">
                <h3 className="font-bold">📌 Conhecimentos Cadastrados</h3>
                <ul>
                    {conhecimentos.map((item, index) => (
                        <li key={index} className="border p-2 mt-2">
                            <strong>❓ {item.pergunta}</strong><br />
                            <span>✅ {item.resposta}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Listagem de Objeções */}
            <div className="mt-4">
                <h3 className="font-bold">⚠️ Objeções Cadastradas</h3>
                <ul>
                    {objecoes.map((item, index) => (
                        <li key={index} className="border p-2 mt-2">
                            <strong>🔴 {item.objecao}</strong><br />
                            <span>🟢 {item.resposta}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default KnowledgeBase;
