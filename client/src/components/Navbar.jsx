function Navbar({ onNavigate, currentPage, user, cartCount }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'menu', label: 'Menu' },
        ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin' }] : []),
    ];

    return (
        <header className="topbar">
            <div className="container topbar-inner">
                <button className="brand-mark" onClick={() => onNavigate(user ? 'dashboard' : 'login')}>
                    <span className="brand-badge">S</span>
                    <span>
                        <strong>SmartShop</strong>
                        <small>College Mess Commerce</small>
                    </span>
                </button>

                <nav className="nav-pills" aria-label="Primary Navigation">
                    {user && navItems.map((item) => (
                        <button
                            key={item.id}
                            className={currentPage === item.id ? 'nav-pill active' : 'nav-pill'}
                            onClick={() => onNavigate(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="topbar-actions">
                    {user ? (
                        <>
                            <div className="topbar-chip">
                                <span className="mini-label">Cart</span>
                                <strong>{cartCount}</strong>
                            </div>
                            <div className="topbar-user">
                                <span className="mini-label">Signed in as</span>
                                <strong>{user.name}</strong>
                                <small>{user.role === 'admin' ? 'Mess Committee' : 'Student Account'}</small>
                            </div>
                            <button className="button button-secondary" onClick={() => onNavigate('logout')}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button className="button button-primary" onClick={() => onNavigate('login')}>
                            Student Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
