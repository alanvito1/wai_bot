import { useState, useEffect } from "react";

function GeneralSettings() {
    const [config, setConfig] = useState({});
    const [originalConfig, setOriginalConfig] = useState({});
    const [status, setStatus] = useState("");
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const apiUrl = "http://localhost:5000/api/settings"; // URL centralizada para fácil ajuste

    // 🔹 Carrega as configurações ao abrir a página
    useEffect(() => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setOriginalConfig(data);
            })
            .catch(err => console.error("❌ Erro ao carregar configurações:", err));
    }, []);

    // 🔹 Atualiza valores conforme o usuário digita
    function handleChange(e) {
        setConfig(prevConfig => ({
            ...prevConfig,
            [e.target.name]: e.target.value
        }));
        setUnsavedChanges(true);
    }

    // 🔹 Salva as configurações no backend e atualiza o bot
    function salvarConfiguracoes() {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        })
        .then(res => res.json())
        .then(() => {
            setStatus("✅ Configurações salvas com sucesso!");
            setUnsavedChanges(false);

            // 🚀 Atualiza o bot automaticamente
            fetch("http://localhost:5000/api/reload-bot", { method: "POST" });

            setTimeout(() => setStatus(""), 3000);
        })
        .catch(err => {
            console.error("❌ Erro ao salvar configurações:", err);
            setStatus("❌ Erro ao salvar configurações!");
        });
    }

    // 🔹 Reverte alterações para os valores salvos
    function reverterAlteracoes() {
        setConfig(originalConfig);
        setUnsavedChanges(false);
    }

    // 🔹 Alerta antes de sair sem salvar
    useEffect(() => {
        const alertaSaida = (event) => {
            if (unsavedChanges) {
                event.preventDefault();
                event.returnValue = "Você tem alterações não salvas. Deseja sair sem salvar?";
            }
        };
        window.addEventListener("beforeunload", alertaSaida);
        return () => window.removeEventListener("beforeunload", alertaSaida);
    }, [unsavedChanges]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">⚙️ Configurações Gerais</h2>

            {/* 🔹 Número do Administrador */}
            <label className="block mb-2">
                Número do Administrador:
                <input
                    type="text"
                    name="adminNumber"
                    value={config.adminNumber || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </label>

            {/* 🔹 Tempo de Inatividade para Follow-Up */}
            <label className="block mb-2">
                Tempo de Inatividade para Follow-Up (min):
                <input
                    type="number"
                    name="followUpTime"
                    value={config.followUpTime || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </label>

            {/* 🔹 Status do Chatbot */}
            <label className="block mb-2">
                Status do Chatbot:
                <select
                    name="botStatus"
                    value={config.botStatus || "ativado"}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value="ativado">Ativado</option>
                    <option value="desativado">Desativado</option>
                </select>
            </label>

            {/* 🔹 Mensagem Padrão de Erro */}
            <label className="block mb-2">
                Mensagem Padrão de Erro:
                <input
                    type="text"
                    name="errorMessage"
                    value={config.errorMessage || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </label>

            {/* 🔹 Timeout da IA */}
            <label className="block mb-2">
                Timeout para Respostas da IA (segundos):
                <input
                    type="number"
                    name="iaTimeout"
                    value={config.iaTimeout || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </label>

            {/* 🔹 Botões de Ação */}
            <div className="flex space-x-2 mt-4">
                <button onClick={salvarConfiguracoes} className="bg-blue-500 text-white px-4 py-2 rounded">
                    💾 Salvar Configurações
                </button>
                <button onClick={reverterAlteracoes} className="bg-gray-500 text-white px-4 py-2 rounded">
                    🔄 Reverter Alterações
                </button>
            </div>

            {/* 🔹 Mensagem de Status */}
            {status && <p className="mt-2 text-green-500">{status}</p>}
        </div>
    );
}

export default GeneralSettings;
