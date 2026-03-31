import { useState, useEffect } from "react";
import axios from "axios";

function Leads() {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/leads")
            .then(response => setLeads(response.data))
            .catch(error => console.error("Erro ao carregar leads:", error));
    }, []);

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "Nome,Telefone,Tipo,Parcela,Prazo\n" +
            leads.map(lead => `${lead.nome},${lead.telefone},${lead.tipo},${lead.valor},${lead.prazo}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <>
            <button onClick={exportToCSV} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                📥 Exportar Leads para CSV
            </button>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">📊 Leads Capturados</h1>
                <ul>
                    {leads.map((lead, index) => (
                        <li key={index} className="border-b p-2">
                            <strong>Nome:</strong> {lead.nome} <br />
                            <strong>Telefone:</strong> {lead.telefone} <br />
                            <strong>Tipo:</strong> {lead.tipo} <br />
                            <strong>Parcela:</strong> R$ {lead.valor} <br />
                            <strong>Prazo:</strong> {lead.prazo} meses
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Leads;
