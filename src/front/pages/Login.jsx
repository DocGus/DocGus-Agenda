import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Login = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();
    const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // use centralized api client
            const apiClient = await import('../utils/apiClient.js').then(m => m.default);
            const data = await apiClient.post('/api/login', formData);

            // Persist auth in global store (store will also persist to localStorage)
            dispatch({ type: 'set_auth', payload: { token: data.token, user: data.user } });
            setSuccess("Inicio de sesión exitoso. Redirigiendo...");

            setTimeout(() => {
                if (data.user.role === "admin") {
                    navigate("/dashboard/admin");
                } else if (data.user.role === "UsuarioAgenda") {
                    navigate("/dashboard/agenda");
                } else {
                    navigate("/");
                }
            }, 800);
        } catch (err) {
            // Log detailed error for debugging
            console.error('Login error:', err);

            // Network-level issues (CORS, backend not reachable) are marked
            // by `apiClient` with `isNetworkError`.
            if (err?.isNetworkError) {
                setError(
                    'No se pudo conectar con el servidor backend. Si trabajas en un entorno remoto (Codespaces/devcontainer), abre la app vía `localhost` o configura `VITE_BACKEND_URL`. Detalle: ' +
                    (err.message || 'Error de red')
                );
            } else if (err?.response) {
                setError(err.response?.message || JSON.stringify(err.response));
            } else {
                setError(err?.message || "Ocurrió un error al conectar con el servidor.");
            }
        }
    };

    const inputStyle = {
        backgroundColor: "#14532d",
        color: "#fff",
        border: "1px solid #198754"
    };

    return (
        <div className="app-page d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #198754 0%, #14532d 100%)", color: "#fff" }}>
            <div className="card p-4 w-100" style={{ maxWidth: "400px", backgroundColor: "#14532d", border: "2px solid #198754", color: "#fff", borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222" }}>
                <h2 className="text-center mb-4 text-white">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-white">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            style={inputStyle}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            style={inputStyle}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-light btn-lg text-dark w-100">Entrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
