import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import NetworkErrorAlert from '../components/NetworkErrorAlert';
import apiClient from '../utils/apiClient';

const Login = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [errorObj, setErrorObj] = useState(null);
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
            console.error('Login error:', err);
            setErrorObj(err);
            if (err?.isNetworkError) {
                setError('No se pudo conectar con el servidor backend. Si trabajas en un entorno remoto, revisa la configuración de `VITE_BACKEND_URL`.');
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
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center px-3" style={{ background: "linear-gradient(135deg, #198754 0%, #14532d 100%)", color: "#fff" }}>
            <div className="card p-4 w-100" style={{ maxWidth: "600px", backgroundColor: "#14532d", border: "2px solid #198754", borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222" }}>
                <h2 className="text-center text-white mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-12">
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
                        <div className="col-12">
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
                    </div>

                    {errorObj?.isNetworkError ? (
                        <NetworkErrorAlert details={errorObj.message} />
                    ) : (
                        error && <div className="alert alert-danger mt-4">{error}</div>
                    )}

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
