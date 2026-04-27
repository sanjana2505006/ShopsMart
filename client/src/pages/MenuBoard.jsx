function MenuBoard({ menuItems, weeklyMenu, cart, totalCartValue, onAddMeal }) {
    return (
        <section className="page page-menu">
            <div className="container stack-lg">
                <section className="hero hero-menu">
                    <div className="hero-copy">
                        <p className="eyebrow">Digital Menu Board</p>
                        <h1>Pick today&apos;s meals before the crowd does.</h1>
                        <p className="hero-text">Browse, add, and check out in a few taps.</p>
                    </div>
                    <div className="cart-summary-card">
                        <span className="mini-label">Current order</span>
                        <strong>{cart.length} item{cart.length === 1 ? '' : 's'}</strong>
                        <p>Total payable: Rs {totalCartValue}</p>
                    </div>
                </section>

                <section className="menu-layout">
                    <div className="panel">
                        <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Today</p>
                                    <h2>Today&apos;s picks</h2>
                                </div>
                        </div>
                        <div className="menu-grid">
                            {menuItems.map((item) => (
                                <article className="menu-card" key={item.id}>
                                    <div className="menu-card-topline">
                                        <span className="pill">{item.category}</span>
                                        <span className="pill subtle-pill">{item.tag}</span>
                                    </div>
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <div className="menu-card-footer">
                                        <strong>Rs {item.price}</strong>
                                        <button className="button button-primary" onClick={() => onAddMeal(item)}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="stack-md">
                        <section className="panel">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Week Ahead</p>
                                    <h2>Menu forecast</h2>
                                </div>
                            </div>
                            <div className="schedule-list">
                                {weeklyMenu.map((day) => (
                                    <div className="schedule-row" key={day.day}>
                                        <div>
                                            <strong>{day.day}</strong>
                                            <p>{day.main}</p>
                                        </div>
                                        <span>{day.side}</span>
                                        <span className={`crowd crowd-${day.crowd.toLowerCase()}`}>{day.crowd}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="panel">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Checkout Snapshot</p>
                                    <h2>Cart summary</h2>
                                </div>
                            </div>
                            <div className="cart-list">
                                {cart.length === 0 ? (
                                    <p className="empty-state">No meals added yet.</p>
                                ) : (
                                    cart.map((item, index) => (
                                        <div className="cart-row" key={`${item.id}-${index}`}>
                                            <div>
                                                <strong>{item.name}</strong>
                                                <p>{item.category}</p>
                                            </div>
                                            <span>Rs {item.price}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default MenuBoard;
