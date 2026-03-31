import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
            localStorage.setItem("token", response.data.token);
            onLogin();
        } catch (error) {
            alert("Usuário ou senha incorretos!");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🔐 Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Usuário" className="border p-2 w-full mb-2" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Senha" className="border p-2 w-full mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
