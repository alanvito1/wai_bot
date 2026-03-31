import { useState, useEffect } from "react";

function Settings() {
    const [config, setConfig] = useState({});
    const [status, setStatus] = useState(""); // Mensagem de status após salvar

    // 🔹 Busca as configurações do backend
    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error("Erro ao carregar configurações:", err));
    }, []);

    // 🔹 Atualiza os valores conforme o usuário digita
    function handleChange(e) {
        setConfig({ ...config, [e.target.name]: e.target.value });
    }

    // 🔹 Envia os dados para o backend ao clicar no botão "Salvar"
    function salvarConfiguracoes() {
        fetch("http://localhost:5000/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        })
        .then(res => res.json())
        .then(data => {
            setStatus("✅ Configurações salvas com sucesso!");
            setTimeout(() => setStatus(""), 3000); // Remove a mensagem após 3 segundos
        })
        .catch(err => setStatus("❌ Erro ao salvar configurações!"));
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">⚙️ Configurações</h2>
            
            <label className="block mb-2">
                Saudação Inicial:
                <input
                    type="text"
                    name="saudacao"
                    value={config.saudacao || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </label>

            <label className="block mb-2">
                Gatilho de Simulação:
                <input
                    type="text"
                    name="gatilho_simulacao"
                    value={config.gatilho_simulacao || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </label>

            {/* 🔹 Botão de salvar */}
            <button onClick={salvarConfiguracoes} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                💾 Salvar Configurações
            </button>

            {/* 🔹 Exibe mensagem de sucesso ou erro */}
            {status && <p className="mt-2 text-green-500">{status}</p>}
        </div>
    );
}

export default Settings;
