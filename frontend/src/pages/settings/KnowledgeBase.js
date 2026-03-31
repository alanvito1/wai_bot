import { useState, useEffect } from "react";

function KnowledgeBase() {
    const [conhecimentos, setConhecimentos] = useState([]);
    const [objecoes, setObjecoes] = useState([]);
    const [novaPergunta, setNovaPergunta] = useState("");
    const [novaResposta, setNovaResposta] = useState("");
    const [novaObjecao, setNovaObjecao] = useState("");
    const [respostaObjecao, setRespostaObjecao] = useState("");
    const [status, setStatus] = useState("");

    // 🔹 Carrega conhecimento e objeções ao abrir a tela
    useEffect(() => {
        fetch("http://localhost:5000/api/knowledge")
            .then(res => res.json())
            .then(data => setConhecimentos(data))
            .catch(err => console.error("Erro ao carregar conhecimento:", err));

        fetch("http://localhost:5000/api/objections")
            .then(res => res.json())
            .then(data => setObjecoes(data))
            .catch(err => console.error("Erro ao carregar objeções:", err));
    }, []);

    // 🔹 Adiciona novo conhecimento
    function adicionarConhecimento() {
        if (!novaPergunta || !novaResposta) {
            setStatus("❌ Preencha ambos os campos!");
            return;
        }

        const novoItem = { pergunta: novaPergunta, resposta: novaResposta };

        fetch("http://localhost:5000/api/knowledge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoItem)
        })
        .then(res => res.json())
        .then(data => {
            setConhecimentos([...conhecimentos, data]);
            setNovaPergunta("");
            setNovaResposta("");
            setStatus("✅ Conhecimento adicionado!");
        })
        .catch(() => setStatus("❌ Erro ao adicionar conhecimento!"));
    }

    // 🔹 Adiciona nova objeção
    function adicionarObjecao() {
        if (!novaObjecao || !respostaObjecao) {
            setStatus("❌ Preencha ambos os campos!");
            return;
        }

        const novoItem = { objecao: novaObjecao, resposta: respostaObjecao };

        fetch("http://localhost:5000/api/objections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoItem)
        })
        .then(res => res.json())
        .then(data => {
            setObjecoes([...objecoes, data]);
            setNovaObjecao("");
            setRespostaObjecao("");
            setStatus("✅ Objeção adicionada!");
        })
        .catch(() => setStatus("❌ Erro ao adicionar objeção!"));
    }

    // 🔹 Remove conhecimento
    function excluirConhecimento(id) {
        fetch(`http://localhost:5000/api/knowledge/${id}`, { method: "DELETE" })
        .then(() => {
            setConhecimentos(conhecimentos.filter(item => item.id !== id));
            setStatus("🗑️ Conhecimento removido!");
        })
        .catch(() => setStatus("❌ Erro ao excluir!"));
    }

    // 🔹 Remove objeção
    function excluirObjecao(id) {
        fetch(`http://localhost:5000/api/objections/${id}`, { method: "DELETE" })
        .then(() => {
            setObjecoes(objecoes.filter(item => item.id !== id));
            setStatus("🗑️ Objeção removida!");
        })
        .catch(() => setStatus("❌ Erro ao excluir!"));
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📚 Banco de Conhecimento & Objeções</h2>

            {/* 🔹 Adicionar Novo Conhecimento */}
            <div className="mb-4">
                <h3 className="font-bold">➕ Adicionar Conhecimento</h3>
                <input type="text" placeholder="Pergunta" value={novaPergunta} onChange={e => setNovaPergunta(e.target.value)} className="border p-2 w-full mb-2" />
                <textarea placeholder="Resposta" value={novaResposta} onChange={e => setNovaResposta(e.target.value)} className="border p-2 w-full mb-2"></textarea>
                <button onClick={adicionarConhecimento} className="bg-blue-500 text-white px-4 py-2 rounded">Adicionar</button>
            </div>

            {/* 🔹 Adicionar Nova Objeção */}
            <div className="mb-4">
                <h3 className="font-bold">⚠️ Adicionar Objeção</h3>
                <input type="text" placeholder="Objeção" value={novaObjecao} onChange={e => setNovaObjecao(e.target.value)} className="border p-2 w-full mb-2" />
                <textarea placeholder="Resposta para contornar" value={respostaObjecao} onChange={e => setRespostaObjecao(e.target.value)} className="border p-2 w-full mb-2"></textarea>
                <button onClick={adicionarObjecao} className="bg-red-500 text-white px-4 py-2 rounded">Adicionar</button>
            </div>

            {status && <p className="mt-2 text-green-500">{status}</p>}

            {/* 🔹 Lista de Conhecimento Cadastrado */}
            <div className="mt-4">
                <h3 className="font-bold">📌 Conhecimentos Cadastrados</h3>
                <ul>
                    {conhecimentos.map((item) => (
                        <li key={item.id} className="border p-2 mt-2 flex justify-between">
                            <div>
                                <strong>❓ {item.pergunta}</strong><br />
                                <span>✅ {item.resposta}</span>
                            </div>
                            <button onClick={() => excluirConhecimento(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">🗑️</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 🔹 Lista de Objeções Cadastradas */}
            <div className="mt-4">
                <h3 className="font-bold">⚠️ Objeções Cadastradas</h3>
                <ul>
                    {objecoes.map((item) => (
                        <li key={item.id} className="border p-2 mt-2 flex justify-between">
                            <div>
                                <strong>🔴 {item.objecao}</strong><br />
                                <span>🟢 {item.resposta}</span>
                            </div>
                            <button onClick={() => excluirObjecao(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">🗑️</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default KnowledgeBase;
