import React, { useState } from 'react';

function MenuBoard() {
    const [menuItems] = useState([
        { id: 1, name: 'Pizza', price: 8.99, category: 'Main' },
        { id: 2, name: 'Burger', price: 6.99, category: 'Main' },
        { id: 3, name: 'Salad', price: 5.99, category: 'Healthy' },
        { id: 4, name: 'Pasta', price: 7.99, category: 'Main' },
        { id: 5, name: 'Sandwich', price: 5.49, category: 'Light' },
        { id: 6, name: 'Soup', price: 4.99, category: 'Light' },
    ]);

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h2 style={styles.title}>Today's Menu</h2>
                <div style={styles.grid}>
                    {menuItems.map((item) => (
                        <div key={item.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.itemName}>{item.name}</h3>
                                <span style={styles.category}>{item.category}</span>
                            </div>
                            <p style={styles.price}>${item.price.toFixed(2)}</p>
                            <button style={styles.button}>Add to Order</button>
                        </div>
                    ))}
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1rem',
    },
    itemName: {
        color: '#2c3e50',
        margin: 0,
        fontSize: '1.25rem',
    },
    category: {
        backgroundColor: '#3498db',
        color: '#fff',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500',
    },
    price: {
        color: '#27ae60',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        margin: '0 0 1rem 0',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default MenuBoard;
