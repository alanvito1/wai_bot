import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

function Connection() {
    const [status, setStatus] = useState("checking");
    const [qr, setQr] = useState("");

    useEffect(() => {
        const fetchStatus = () => {
            axios.get("http://localhost:5000/api/status")
                .then(response => {
                    setStatus(response.data.status);
                    setQr(response.data.qr);
                })
                .catch(error => console.error("Erro ao carregar status:", error));
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Atualiza a cada 5 segundos

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">🔌 Conexão do WhatsApp</h1>

            <div className="bg-white p-8 rounded-lg shadow-lg border flex flex-col items-center max-w-md w-full">
                {status === "connected" ? (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-xl font-bold text-green-600 mb-2">Bot Conectado!</h2>
                        <p className="text-gray-600">O seu WhatsApp já está pareado e pronto para responder mensagens.</p>
                    </div>
                ) : status === "waiting_qr" && qr ? (
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-4">Escaneie o QR Code</h2>
                        <div className="bg-white p-4 border-4 border-blue-500 rounded-lg inline-block mb-4">
                            <QRCodeCanvas value={qr} size={256} />
                        </div>
                        <p className="text-gray-600 text-sm">Abra o WhatsApp no seu celular {'>'} Aparelhos Conectados {'>'} Conectar um Aparelho.</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
                        <h2 className="text-xl font-bold mb-2">Aguardando Bot...</h2>
                        <p className="text-gray-600 text-sm">O bot está inicializando ou gerando o QR Code. Aguarde alguns segundos.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 text-sm text-gray-500 bg-gray-100 p-4 rounded max-w-lg">
                <h3 className="font-bold mb-2">💡 Dicas:</h3>
                <ul className="list-disc ml-5 space-y-1">
                    <li>Certifique-se de que o Docker está rodando.</li>
                    <li>Se o QR Code demorar muito, tente reiniciar o container `waibot-app`.</li>
                    <li>Uma vez conectado, o navegador não precisa ficar aberto nesta página.</li>
                </ul>
            </div>
        </div>
    );
}

export default Connection;
