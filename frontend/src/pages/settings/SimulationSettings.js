import { useState, useEffect } from "react";

function SimulationSettings() {
    const [fluxo, setFluxo] = useState([]);
    const [novaOrdem, setNovaOrdem] = useState("");
    const [novaEtapa, setNovaEtapa] = useState("");
    const [novaPergunta, setNovaPergunta] = useState("");
    const [novaValidacao, setNovaValidacao] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        carregarFluxo();
    }, []);

    function carregarFluxo() {
        fetch("http://localhost:5000/api/simulation")
            .then(res => res.json())
            .then(data => setFluxo(data))
            .catch(() => setStatus("❌ Erro ao carregar fluxo de simulação"));
    }

    function adicionarEtapa() {
        if (!novaOrdem || !novaEtapa || !novaPergunta) {
            setStatus("❌ Preencha todos os campos!");
            return;
        }

        fetch("http://localhost:5000/api/simulation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ordem: novaOrdem, etapa: novaEtapa, pergunta: novaPergunta, validacao: novaValidacao })
        })
        .then(() => {
            carregarFluxo();
            setNovaOrdem("");
            setNovaEtapa("");
            setNovaPergunta("");
            setNovaValidacao("");
            setStatus("✅ Etapa adicionada com sucesso!");
        })
        .catch(() => setStatus("❌ Erro ao adicionar etapa!"));
    }

    function atualizarEtapa(id, ordem, etapa, pergunta, validacao) {
        fetch(`http://localhost:5000/api/simulation/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ordem, etapa, pergunta, validacao })
        })
        .then(() => {
            carregarFluxo();
            setStatus("✅ Etapa atualizada com sucesso!");
        })
        .catch(() => setStatus("❌ Erro ao atualizar etapa!"));
    }

    function excluirEtapa(id) {
        fetch(`http://localhost:5000/api/simulation/${id}`, { method: "DELETE" })
        .then(() => carregarFluxo())
        .catch(() => setStatus("❌ Erro ao remover etapa!"));
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">📊 Configuração do Fluxo de Simulação</h2>

            <div className="mb-4 p-4 border rounded bg-white shadow">
                <h3 className="font-bold mb-2">➕ Adicionar Nova Etapa</h3>
                <input type="number" placeholder="Ordem" value={novaOrdem} onChange={e => setNovaOrdem(e.target.value)} className="border p-2 w-full mb-2" />
                <input type="text" placeholder="Nome da Etapa" value={novaEtapa} onChange={e => setNovaEtapa(e.target.value)} className="border p-2 w-full mb-2" />
                <textarea placeholder="Pergunta" value={novaPergunta} onChange={e => setNovaPergunta(e.target.value)} className="border p-2 w-full mb-2"></textarea>
                <select value={novaValidacao} onChange={e => setNovaValidacao(e.target.value)} className="border p-2 w-full mb-2">
                    <option value="">Sem validação</option>
                    <option value="telefone">Telefone</option>
                    <option value="email">E-mail</option>
                    <option value="mes">Mês</option>
                    <option value="valor">Valor</option>
                </select>
                <button onClick={adicionarEtapa} className="bg-blue-500 text-white px-4 py-2 rounded w-full">💾 Adicionar</button>
            </div>

            <h3 className="font-bold mt-6 mb-2">📌 Etapas Cadastradas</h3>

            {/* 🔹 Tabela Interativa */}
            <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">#</th>
                        <th className="border p-2">Ordem</th>
                        <th className="border p-2">Nome da Etapa</th>
                        <th className="border p-2">Pergunta</th>
                        <th className="border p-2">Validação</th>
                        <th className="border p-2">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {fluxo.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border p-2 text-center">{index + 1}</td>
                            <td className="border p-2 text-center">
                                <input type="number" value={item.ordem} onChange={e => atualizarEtapa(item.id, e.target.value, item.etapa, item.pergunta, item.validacao)} className="border p-1 w-16 text-center" />
                            </td>
                            <td className="border p-2">
                                <input type="text" value={item.etapa} onChange={e => atualizarEtapa(item.id, item.ordem, e.target.value, item.pergunta, item.validacao)} className="border p-1 w-full" />
                            </td>
                            <td className="border p-2">
                                <textarea value={item.pergunta} onChange={e => atualizarEtapa(item.id, item.ordem, item.etapa, e.target.value, item.validacao)} className="border p-1 w-full"></textarea>
                            </td>
                            <td className="border p-2">
                                <select value={item.validacao || ""} onChange={e => atualizarEtapa(item.id, item.ordem, item.etapa, item.pergunta, e.target.value)} className="border p-1 w-full">
                                    <option value="">Sem validação</option>
                                    <option value="telefone">Telefone</option>
                                    <option value="email">E-mail</option>
                                    <option value="mes">Mês</option>
                                    <option value="valor">Valor</option>
                                </select>
                            </td>
                            <td className="border p-2 text-center">
                                <button onClick={() => excluirEtapa(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {status && <p className="mt-4 text-red-500">{status}</p>}
        </div>
    );
}

export default SimulationSettings;
