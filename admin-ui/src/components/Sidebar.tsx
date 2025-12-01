import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export const Sidebar = () => {
    const location = useLocation();

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h2>LLM Sandbox</h2>
            </div>
            <ul className="sidebar-nav">
                <li>
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        <span className="icon">🎮</span>
                        <span>Playground</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/admin"
                        className={location.pathname.startsWith('/admin') ? 'active' : ''}
                    >
                        <span className="icon">📊</span>
                        <span>Admin</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
