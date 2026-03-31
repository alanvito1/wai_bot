import { useState, useEffect } from "react";

function FollowUpSettings() {
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
            <h2 className="text-xl font-bold mb-4">📅 Configurações de Agendamento & Follow-Up</h2>

            {/* 🔹 Tempo do Primeiro Follow-Up */}
            <label className="block mb-2">Tempo do Primeiro Follow-Up (min):
                <input type="number" name="followUp1" value={config.followUp1 || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Tempo do Segundo Follow-Up */}
            <label className="block mb-2">Tempo do Segundo Follow-Up (min):
                <input type="number" name="followUp2" value={config.followUp2 || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Horários Disponíveis para Agendamento */}
            <label className="block mb-2">Horários Disponíveis (separados por vírgula):
                <input type="text" name="availableTimes" value={config.availableTimes || ""} onChange={handleChange} className="border p-2 w-full" placeholder="Ex: 09:00, 14:00, 17:00" />
            </label>

            {/* 🔹 Dias da Semana Permitidos */}
            <label className="block mb-2">Dias Permitidos para Agendamento:
                <input type="text" name="availableDays" value={config.availableDays || ""} onChange={handleChange} className="border p-2 w-full" placeholder="Ex: Segunda, Terça, Quarta" />
            </label>

            {/* 🔹 Duração da Reunião */}
            <label className="block mb-2">Duração Padrão da Reunião (min):
                <input type="number" name="meetingDuration" value={config.meetingDuration || ""} onChange={handleChange} className="border p-2 w-full" />
            </label>

            {/* 🔹 Mensagem de Lembrete */}
            <label className="block mb-2">Mensagem Padrão de Lembrete:
                <textarea name="reminderMessage" value={config.reminderMessage || ""} onChange={handleChange} className="border p-2 w-full" placeholder="Ex: Olá! Lembre-se da nossa reunião hoje às..." />
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

export default FollowUpSettings;
