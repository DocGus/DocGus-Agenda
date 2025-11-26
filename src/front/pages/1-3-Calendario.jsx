import React from "react";
import { Link } from "react-router-dom";

export const Calendario = () => (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center py-4" style={{ minHeight: "100vh", backgroundColor: "#1a2238", color: "#fff" }}>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4 justify-content-center" style={{ maxWidth: 1200 }}>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Integración total</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Sincroniza actividades y notas en tu calendario.</p>
                    </div>
                </div>
            </div>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Seguimiento de metas</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Consulta tu avance y celebra logros en cada periodo.</p>
                    </div>
                </div>
            </div>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Interfaz amigable</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Colorida, clara y fácil de usar para todos.</p>
                    </div>
                </div>
            </div>
            <div className="col d-flex">
                <div className="card flex-fill" style={{ background: "#4fc3f7", color: "#fff", border: 0, borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222", minWidth: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                        <h5 className="card-title mb-2" style={{ color: '#fff' }}>Vista mensual</h5>
                        <p className="card-text" style={{ color: '#fff' }}>Visualiza todas tus actividades y metas de un vistazo.</p>
                    </div>
                </div>
            </div>
        </div>
        <Link to="/" className="btn btn-light text-dark fw-bold shadow">Volver al inicio</Link>
    </div>
);
