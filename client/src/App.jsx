import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import MenuBoard from './pages/MenuBoard';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
        setCurrentPage('dashboard');
    };

    const handleNavigate = (page) => {
        if (page === 'login' && user) {
            // Logout
            setUser(null);
            setCurrentPage('login');
        } else {
            setCurrentPage(page);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <Login onLogin={handleLogin} />;
            case 'dashboard':
                return user ? <StudentDashboard /> : <Login onLogin={handleLogin} />;
            case 'menu':
                return <MenuBoard />;
            default:
                return <Login onLogin={handleLogin} />;
        }
    };

    return (
        <div>
            <Navbar onNavigate={handleNavigate} currentPage={currentPage} user={user} />
            <main>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
