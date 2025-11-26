import React from "react";
import { Link } from "react-router-dom";

export const Notas = () => (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center py-4" style={{ minHeight: "100vh", backgroundColor: "#1a2238", color: "#fff" }}>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4 justify-content-center" style={{ maxWidth: 1200 }}>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Notas rápidas</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Guarda ideas, recordatorios y tareas sueltas en segundos.</p>
                    </div>
                </div>
            </div>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Organización visual</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Agrupa, busca y filtra tus notas fácilmente y sin esfuerzo.</p>
                    </div>
                </div>
            </div>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Acceso rápido</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Tus notas siempre disponibles, desde cualquier dispositivo.</p>
                    </div>
                </div>
            </div>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Búsqueda eficiente</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Encuentra lo que necesitas al instante con filtros inteligentes.</p>
                    </div>
                </div>
            </div>
        </div>
        <Link to="/" className="btn btn-light text-dark fw-bold shadow">Volver al inicio</Link>
    </div>
);
