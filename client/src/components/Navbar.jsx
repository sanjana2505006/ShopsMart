import React from 'react';

function Navbar({ onNavigate, currentPage, user }) {
    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <h1 style={styles.logo}>ShopSmart</h1>
                <div style={styles.links}>
                    {user ? (
                        <>
                            <button 
                                onClick={() => onNavigate('dashboard')}
                                style={currentPage === 'dashboard' ? styles.activeLink : styles.link}
                            >
                                Dashboard
                            </button>
                            <button 
                                onClick={() => onNavigate('menu')}
                                style={currentPage === 'menu' ? styles.activeLink : styles.link}
                            >
                                Menu
                            </button>
                            <button 
                                onClick={() => onNavigate('login')}
                                style={styles.link}
                            >
                                Logout
                            </button>
                            <span style={styles.userName}>Welcome, {user.name || user.email}</span>
                        </>
                    ) : (
                        <button 
                            onClick={() => onNavigate('login')}
                            style={styles.link}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        backgroundColor: '#2c3e50',
        padding: '1rem 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        color: '#fff',
        margin: 0,
        fontSize: '1.5rem',
    },
    links: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    link: {
        color: '#ecf0f1',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    },
    activeLink: {
        color: '#fff',
        background: '#34495e',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
    },
    userName: {
        color: '#ecf0f1',
        fontSize: '0.9rem',
        marginLeft: '1rem',
    },
};

export default Navbar;
