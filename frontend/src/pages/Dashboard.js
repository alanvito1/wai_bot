import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function Dashboard() {
    const [horarios, setHorarios] = useState([]);
    const [stats, setStats] = useState({});
    const [leadsHistory, setLeadsHistory] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/stats")
            .then(response => setStats(response.data))
            .catch(error => console.error("Erro ao carregar estatísticas:", error));
    
        axios.get("http://localhost:5000/api/stats/horarios")
            .then(response => setHorarios(response.data))
            .catch(error => console.error("Erro ao carregar horários:", error));
    
        axios.get("http://localhost:5000/api/stats/leads")
            .then(response => setLeadsHistory(response.data))
            .catch(error => console.error("Erro ao carregar leads:", error));
    }, []);

    const conversao = stats.totalLeads > 0 ? ((stats.finalizados / stats.totalLeads) * 100).toFixed(2) : 0;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📊 Dashboard de Desempenho</h1>

            {/* Estatísticas principais */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500 text-white p-4 rounded shadow-md">
                    <h2 className="text-lg">📌 Leads Capturados</h2>
                    <p className="text-2xl">{stats.totalLeads}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded shadow-md">
                    <h2 className="text-lg">📖 Perguntas na Base</h2>
                    <p className="text-2xl">{stats.totalPerguntas}</p>
                </div>
                <div className="bg-yellow-500 text-white p-4 rounded shadow-md">
                    <h2 className="text-lg">📨 Mensagens Processadas</h2>
                    <p className="text-2xl">{stats.totalMensagens}</p>
                </div>
            </div>

            {/* Taxa de Conversão */}
            <div className="bg-purple-500 text-white p-4 rounded shadow-md mb-6">
                <h2 className="text-lg">🎯 Taxa de Conversão</h2>
                <p className="text-2xl">{conversao}%</p>
            </div>

            {/* Gráfico de horários de pico */}
            <h2 className="text-xl font-bold mb-2">⏰ Horários de Pico do Chatbot</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={horarios}>
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

            {/* Gráfico de evolução de leads */}
            <h2 className="text-xl font-bold mb-2">📈 Evolução dos Leads</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadsHistory}>
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            {/* Gráfico de Engajamento */}
            <h2 className="text-xl font-bold mb-2">📊 Engajamento do Cliente</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={[
                            { name: "Finalizaram Simulação", value: stats.finalizados || 0 },
                            { name: "Não Responderam", value: stats.naoRespondidos || 0 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        <Cell fill="#28a745" />
                        <Cell fill="#dc3545" />
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Dashboard;
