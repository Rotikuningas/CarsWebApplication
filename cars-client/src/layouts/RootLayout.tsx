import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
    return (
        <div className="container">
            <nav className="navbar">
                <NavLink to="/">Strona główna</NavLink>
                <NavLink to="/cars">Samochody</NavLink>
                <NavLink to="/cars/new">Dodaj samochód</NavLink>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
