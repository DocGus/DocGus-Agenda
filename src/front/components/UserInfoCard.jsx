import React from "react";

const UserInfoCard = ({ user }) => {
    if (!user) return null;
    return (
        <div className="card bg-dark text-light mb-3">
            <div className="card-body">
                <h5 className="card-title">{user.name || user.username || "Usuario"}</h5>
                <p className="card-text mb-1"><strong>Email:</strong> {user.email}</p>
                <p className="card-text mb-1"><strong>Rol:</strong> {user.role || "N/A"}</p>
                {/* Agrega más campos según la estructura de tu usuario */}
            </div>
        </div>
    );
};

export default UserInfoCard;
