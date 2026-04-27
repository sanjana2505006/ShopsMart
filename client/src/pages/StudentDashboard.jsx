import React from 'react';

function StudentDashboard() {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h2 style={styles.title}>Student Dashboard</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Meal Balance</h3>
                        <p style={styles.cardValue}>$125.50</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Meals This Week</h3>
                        <p style={styles.cardValue}>12</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Favorite Item</h3>
                        <p style={styles.cardValue}>Pizza</p>
                    </div>
                </div>
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Recent Orders</h3>
                    <p style={styles.placeholder}>No recent orders</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#ecf0f1',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem',
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    title: {
        color: '#2c3e50',
        marginBottom: '2rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    card: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        color: '#7f8c8d',
        fontSize: '0.9rem',
        fontWeight: '500',
        marginBottom: '0.5rem',
    },
    cardValue: {
        color: '#2c3e50',
        fontSize: '2rem',
        fontWeight: 'bold',
        margin: 0,
    },
    section: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        color: '#2c3e50',
        marginBottom: '1rem',
    },
    placeholder: {
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
};

export default StudentDashboard;
