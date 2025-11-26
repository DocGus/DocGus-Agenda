import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import UserInfoCard from "../components/UserInfoCard";

const UserDash = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const user = store?.auth?.user;

  const handleLogout = () => {
    dispatch({ type: 'logout' });
    navigate('/');
  };

  return (
    <div className="app-page min-vh-100 d-flex flex-column" style={{ background: "linear-gradient(135deg, #198754 0%, #14532d 100%)", color: "#fff" }}>
      <header className="py-3 text-center">
        <h1 className="mb-1">Panel de Usuario</h1>
        <p className="small mb-0">Bienvenido a tu panel — revisa tu información y sal.</p>
      </header>
      <main className="container my-4" style={{ flex: '1 0 auto' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <UserInfoCard user={user} />
            <div className="d-flex gap-2">
              <button className="btn btn-light text-dark" onClick={() => navigate('/')}>Volver al Home</button>
              <button className="btn btn-outline-light" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-3 small mt-auto">&copy; 2025 DocGus Agenda</footer>
    </div>
  );
};

export default UserDash;
