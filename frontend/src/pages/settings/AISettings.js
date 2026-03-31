import { useState, useEffect } from "react";

function AISettings() {
    const [config, setConfig] = useState({});
    const [originalConfig, setOriginalConfig] = useState({});
    const [status, setStatus] = useState("");
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const apiUrl = "http://localhost:5000/api/settings";

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

    // 🔹 Salva as configurações no backend e reinicia o bot
    function salvarConfiguracoes() {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        })
        .then(() => {
            setStatus("✅ Configurações salvas com sucesso!");
            setUnsavedChanges(false);

            // 🚀 Atualiza o bot automaticamente
            fetch("http://localhost:5000/api/reload-bot", { method: "POST" });

            setTimeout(() => setStatus(""), 3000);
        })
        .catch(() => setStatus("❌ Erro ao salvar configurações!"));
    }

    // 🔹 Reverter alterações para o último estado salvo
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
            <h2 className="text-xl font-bold mb-4">🤖 Configurações da IA</h2>

            {/* 🔹 Prompt da IA */}
            <label className="block mb-2">Prompt da IA:
                <textarea name="iaPrompt" value={config.iaPrompt || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Temperatura da IA */}
            <label className="block mb-2">Temperatura da IA (Criatividade):
                <input type="number" step="0.1" min="0" max="1" name="iaTemperature" value={config.iaTemperature || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Máximo de Tokens */}
            <label className="block mb-2">Máximo de Tokens:
                <input type="number" name="iaMaxTokens" value={config.iaMaxTokens || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Modelo da IA */}
            <label className="block mb-2">Modelo de IA:
                <select name="iaModel" value={config.iaModel || "deepseek-chat"} onChange={handleChange} className="border p-2 w-full">
                    <option value="deepseek-chat">DeepSeek Chat</option>
                    <option value="deepseek-reasoner">DeepSeek R1 (Raciocínio Avançado)</option>
                    <option value="gpt-4">GPT-4</option>
                </select>
            </label>

            {/* 🔹 Tempo limite de resposta */}
            <label className="block mb-2">Tempo Limite para Respostas (segundos):
                <input type="number" name="iaTimeout" value={config.iaTimeout || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Chave da API */}
            <label className="block mb-2">Chave da API DeepSeek:
                <input type="text" name="deepSeekApiKey" value={config.deepSeekApiKey || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Botões de ação */}
            <div className="flex space-x-2 mt-4">
                <button onClick={salvarConfiguracoes} className="bg-blue-500 text-white px-4 py-2 rounded">
                    💾 Salvar Configurações
                </button>
                <button onClick={reverterAlteracoes} className="bg-gray-500 text-white px-4 py-2 rounded">
                    🔄 Reverter Alterações
                </button>
            </div>

            {/* 🔹 Mensagem de status */}
            {status && <p className="mt-2 text-green-500">{status}</p>}
        </div>
    );
}

export default AISettings;
