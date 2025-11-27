import React from "react";

const NetworkErrorAlert = ({ details }) => {
  return (
    <div className="alert alert-warning d-flex align-items-start" role="alert">
      <div>
        <strong>Problema de conexión</strong>
        <div style={{ marginTop: 4 }}>
          No se pudo conectar con el servidor backend desde este host.
          Si estás usando un entorno remoto (Codespaces/devcontainer), prueba:
        </div>
        <ul style={{ marginTop: 6 }}>
          <li>Acceder a la app vía <code>localhost</code> en tu máquina</li>
          <li>Configurar `VITE_BACKEND_URL` en el archivo `.env` para apuntar al backend</li>
          <li>Verifica que el backend esté corriendo en <code>127.0.0.1:3001</code></li>
        </ul>
        {details && (
          <div style={{ marginTop: 6 }} className="small text-muted">Detalle: {details}</div>
        )}
      </div>
    </div>
  );
};

export default NetworkErrorAlert;
