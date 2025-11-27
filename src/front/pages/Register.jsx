import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import NetworkErrorAlert from '../components/NetworkErrorAlert';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const BACKEND = import.meta.env.VITE_BACKEND_URL || "";
    const queryParams = new URLSearchParams(location.search);
    const roleFromURL = queryParams.get("role") || "";

    const [formData, setFormData] = useState({
        first_name: "",
        second_name: "",
        first_surname: "",
        second_surname: "",
        birth_day: "",
        phone: "",
        email: "",
        password: "",
        role: roleFromURL
    });

    const [error, setError] = useState("");
    const [errorObj, setErrorObj] = useState(null);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: roleFromURL }));
    }, [roleFromURL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (
            !formData.first_name ||
            !formData.first_surname ||
            !formData.birth_day ||
            !formData.email ||
            !formData.password ||
            !formData.phone ||
            !formData.role
        ) {
            setError("Por favor llena todos los campos obligatorios.");
            return;
        }

        // Eliminada validación de institución

        try {
            const response = await fetch(`${BACKEND}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Error al registrar");
            } else {
                setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (err) {
            console.error('Register error:', err);
            setErrorObj(err);
            if (err?.isNetworkError) {
                setError('Error de red: no se pudo conectar con el servidor.');
            } else if (err?.response) {
                // API returned a JSON error body
                const msg = err.response?.message || JSON.stringify(err.response);
                setError(msg);
            } else {
                setError(err?.message || 'Error al registrar');
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
            <div className="card p-4 w-100" style={{ maxWidth: "900px", backgroundColor: "#14532d", border: "2px solid #198754", borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222" }}>
                <h2 className="text-center text-white mb-4">Registro de {formData.role || "UsuarioAgenda"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Campos básicos */}
                        {[
                            { label: "Primer Nombre", name: "first_name", type: "text", required: true },
                            { label: "Segundo Nombre", name: "second_name", type: "text" },
                            { label: "Primer Apellido", name: "first_surname", type: "text", required: true },
                            { label: "Segundo Apellido", name: "second_surname", type: "text" },
                            { label: "Fecha de Nacimiento", name: "birth_day", type: "date", required: true },
                            { label: "Correo Electrónico", name: "email", type: "email", required: true },
                            { label: "Contraseña", name: "password", type: "password", required: true }
                        ].map(field => (
                            <div className="col-12 col-md-6 col-lg-4" key={field.name}>
                                <label className="form-label text-white">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    className="form-control"
                                    style={inputStyle}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                />
                            </div>
                        ))}
                        {/* Campo Teléfono con bandera y lada */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <label className="form-label text-white">Teléfono (WhatsApp)</label>
                            <PhoneInput
                                country={"mx"}
                                enableSearch
                                value={formData.phone}
                                onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                                inputStyle={{
                                    backgroundColor: "#14532d",
                                    color: "#fff",
                                    border: "1px solid #198754",
                                    width: "100%"
                                }}
                                containerStyle={{ width: "100%" }}
                                inputClass="form-control"
                                specialLabel=""
                            />
                        </div>
                        {/* ...eliminado campo institución... */}
                    </div>
                    {errorObj?.isNetworkError ? (
                        <NetworkErrorAlert details={errorObj.message} />
                    ) : (
                        error && <div className="alert alert-danger mt-4">{error}</div>
                    )}
                    {success && <div className="alert alert-success mt-4">{success}</div>}
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-light btn-lg text-dark w-100">Registrarme</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
