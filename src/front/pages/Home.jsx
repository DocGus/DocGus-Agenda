
import React from "react";
import logo from "../assets/img/rigo-baby.jpg"; // Cambia por tu logo real si lo tienes
import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<div
			className="container-fluid d-flex flex-column position-relative"
			style={{ minHeight: "100vh", backgroundColor: "#14532d", color: "#fff", padding: "0" }}
		>
			{/* Header: título y tagline */}
			<header className="py-2 text-center page-foreground">
				<h1 className="mb-1">DocGus Agenda</h1>
				<h2 className="mb-1">Organiza tus metas y actividades</h2>
				<p className="small mb-0">Gestión de actividades, metas y productividad personal</p>
			</header>

			{/* Main: grid de navegación por áreas y botones de registro/login */}
			<main
				className="d-flex flex-column align-items-center justify-content-center page-foreground"
				style={{ flex: "0 1 auto", padding: "2rem 0" }}
			>
				{/* Párrafo cálido y breve que explica el propósito */}
				<p className="small mb-3 text-center" style={{ maxWidth: 720, margin: "0 auto" }}>
					“Bienvenido a DocGus Agenda, tu espacio digital para planificar actividades, fijar metas, tomar notas y visualizar tu progreso de forma clara y motivadora.”
				</p>

				{/* Tarjetas de acceso rápido a secciones */}
				<div className="row row-cols-1 row-cols-md-3 g-2"
					style={{
						maxWidth: "900px",
						width: "100%",
						margin: "0 auto",
						background: "#fff",
						border: "3px solid #198754",
						borderRadius: "2rem",
						boxShadow: "0 4px 24px #2224",
						padding: "2rem 1rem",
						position: "relative",
						zIndex: 2
					}}>
					<div className="col">
						<Link to="/actividades" className="text-decoration-none">
							<div className="card h-100" style={{ background: "#198754", color: "#fff", border: "2px solid #198754", borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222" }}>
								<div className="card-body p-2 d-flex flex-column align-items-center justify-content-center">
									<h6 className="card-title mb-1 fw-bold">Actividades</h6>
									<p className="card-text small mb-0">¡Organiza tu movimiento!</p>
								</div>
							</div>
						</Link>
					</div>
					<div className="col">
						<Link to="/notas" className="text-decoration-none">
							<div className="card h-100" style={{ background: "#198754", color: "#fff", border: "2px solid #198754", borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222" }}>
								<div className="card-body p-2 d-flex flex-column align-items-center justify-content-center">
									<h6 className="card-title mb-1 fw-bold">Notas rápidas</h6>
									<p className="card-text small mb-0">Guarda ideas y recordatorios.</p>
								</div>
							</div>
						</Link>
					</div>
					<div className="col">
						<Link to="/calendario" className="text-decoration-none">
							<div className="card h-100" style={{ background: "#198754", color: "#fff", border: "2px solid #198754", borderRadius: "1.5rem", boxShadow: "0 2px 12px #2222" }}>
								<div className="card-body p-2 d-flex flex-column align-items-center justify-content-center">
									<h6 className="card-title mb-1 fw-bold">Calendario</h6>
									<p className="card-text small mb-0">Visualiza tus metas y actividades.</p>
								</div>
							</div>
						</Link>
					</div>
				</div>

				{/* CTAs de registro segmentados por rol (solo UsuarioAgenda por ahora) */}
				<div className="mt-2 d-flex justify-content-center flex-wrap gap-1">
					<Link to="/register?role=UsuarioAgenda" className="btn btn-light btn-sm text-dark order-1">
						Registro de UsuarioAgenda
					</Link>
				</div>
			</main>

			{/* Logo grande al fondo de la página (clickable) + botón de Iniciar Sesión */}
			<div className="text-center page-foreground pb-3 brand-bottom-cta">
				<Link
					to="/login"
					aria-label="Iniciar sesión"
					className="d-inline-block text-decoration-none"
					style={{
						background: "#198754",
						color: "#fff",
						border: "3px solid #fff",
						borderRadius: "2rem",
						padding: "1.5rem 2rem",
						boxShadow: "0 4px 24px #2224",
						maxWidth: "260px",
						margin: "0 auto"
					}}
				>
					<div className="d-flex flex-column align-items-center justify-content-center">
						<img src={logo} alt="DocGus Agenda" style={{ maxWidth: 120, opacity: 0.85, marginBottom: "1rem" }} />
						<span className="fw-semibold" style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>Iniciar sesión</span>
					</div>
				</Link>
			</div>

			{/* Footer: aviso de derechos reservado y año */}
			<footer className="text-center py-2 mt-auto small">
				&copy; 2025 DocGus Agenda. Todos los derechos reservados.
			</footer>
		</div>
	);
};