import { useState, useEffect } from "react";
import GeneralSettings from "./GeneralSettings";
import AISettings from "./AISettings";
import MessageSettings from "./MessageSettings";
import SimulationSettings from "./SimulationSettings";
import KnowledgeBase from "./KnowledgeBase";

function Settings() {
    const abas = {
        geral: "⚙️ Geral",
        ia: "🤖 IA",
        mensagens: "💬 Mensagens",
        simulacao: "📊 Simulação",
        conhecimento: "📚 Banco de Conhecimento"
    };

    // 🔹 Inicializa a aba com base na URL ou padrão "geral"
    const [abaAtiva, setAbaAtiva] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("aba") || "geral";
    });

    // 🔹 Atualiza a URL sempre que a aba for trocada
    useEffect(() => {
        const url = new URL(window.location);
        url.searchParams.set("aba", abaAtiva);
        window.history.replaceState({}, "", url);
    }, [abaAtiva]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">⚙️ Configurações</h2>

            {/* 🔹 Menu de abas */}
            <div className="flex space-x-4 border-b pb-2 mb-4">
                {Object.entries(abas).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setAbaAtiva(key)}
                        className={`px-3 py-1 rounded ${abaAtiva === key ? "bg-blue-500 text-white font-bold" : "hover:bg-gray-200"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* 🔹 Renderiza a aba ativa */}
            {abaAtiva === "geral" && <GeneralSettings />}
            {abaAtiva === "ia" && <AISettings />}
            {abaAtiva === "mensagens" && <MessageSettings />}
            {abaAtiva === "simulacao" && <SimulationSettings />}
            {abaAtiva === "conhecimento" && <KnowledgeBase />}
        </div>
    );
}

export default Settings;
