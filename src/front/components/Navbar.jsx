import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light" style={{ background: "#fff" }}>
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1" style={{ color: "#198754", fontWeight: "bold", letterSpacing: "1px" }}>DocGus Agenda</span>
				</Link>
				<div className="ml-auto d-flex gap-2">
					<Link to="/">
						<button className="btn" style={{ background: "#fff", color: "#198754", fontWeight: "bold", border: "2px solid #198754", borderRadius: "1rem", letterSpacing: "1px" }}>Home</button>
					</Link>
					<Link to="/demo">
						<button className="btn" style={{ background: "#fff", color: "#14532d", fontWeight: "bold", border: "2px solid #14532d", borderRadius: "1rem", letterSpacing: "1px" }}>Agenda</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};