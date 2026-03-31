import { useState, useEffect } from "react";

function MessageSettings() {
    const [config, setConfig] = useState({});
    const [originalConfig, setOriginalConfig] = useState({});
    const [status, setStatus] = useState("");
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    // 🔹 Carrega as configurações do banco ao abrir a página
    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setOriginalConfig(data);
            })
            .catch(err => console.error("Erro ao carregar configurações:", err));
    }, []);

    // 🔹 Atualiza valores conforme o usuário digita
    function handleChange(e) {
        setConfig({ ...config, [e.target.name]: e.target.value });
        setUnsavedChanges(true);
    }

    // 🔹 Salva as configurações no backend
    function salvarConfiguracoes() {
        fetch("http://localhost:5000/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        })
        .then(() => {
            setStatus("✅ Configurações salvas!");
            setUnsavedChanges(false);
            setTimeout(() => setStatus(""), 3000);
        })
        .catch(() => setStatus("❌ Erro ao salvar!"));
    }

    // 🔹 Reverte alterações para os valores anteriores
    function reverterAlteracoes() {
        setConfig(originalConfig);
        setUnsavedChanges(false);
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">💬 Configurações de Mensagens</h2>

            {/* 🔹 Tabela de Configurações */}
            <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">🔹 Configuração</th>
                        <th className="border p-2 text-left">📩 Valor Atual</th>
                        <th className="border p-2 text-left">✏️ Novo Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { key: "saudacao", label: "🟢 Saudação (Mensagem de Boas-Vindas)" },
                        { key: "errorMessage", label: "❌ Mensagem de Erro" },
                        { key: "followUpMessage", label: "🔄 Mensagem de Follow-Up" },
                        { key: "appointmentConfirmationMessage", label: "📅 Mensagem de Confirmação de Agendamento" },
                        { key: "simulationCompletedMessage", label: "📊 Mensagem de Simulação Concluída" }
                    ].map(({ key, label }) => (
                        <tr key={key} className="hover:bg-gray-50">
                            <td className="border p-2 font-semibold">{label}</td>
                            <td className="border p-2 text-gray-600">{config[key] || "Não definido"}</td>
                            <td className="border p-2">
                                <textarea 
                                    name={key} 
                                    value={config[key] || ""} 
                                    onChange={handleChange} 
                                    className="border p-2 w-full"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🔹 Ações */}
            <div className="flex space-x-2 mt-6">
                <button onClick={salvarConfiguracoes} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    💾 Salvar Configurações
                </button>
                <button onClick={reverterAlteracoes} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    🔄 Reverter Alterações
                </button>
            </div>

            {status && <p className="mt-4 text-green-500 font-semibold">{status}</p>}
        </div>
    );
}

export default MessageSettings;
