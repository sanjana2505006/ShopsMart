function AdminPanel({ stats, plans, weeklyMenu, feedbackItems, orders }) {
    return (
        <section className="page page-admin">
            <div className="container stack-lg">
                <section className="hero hero-admin">
                    <div className="hero-copy">
                        <p className="eyebrow">Mess Committee Console</p>
                        <h1>Run the mess like a modern campus operation.</h1>
                        <p className="hero-text">
                            Track subscriptions, update menus, read feedback, and adjust prep counts
                            before rush hour starts.
                        </p>
                    </div>
                    <div className="admin-highlight-panel">
                        <span className="mini-label">Today</span>
                        <strong>618 lunches expected</strong>
                        <p>58 students opted out before the 10:00 AM cutoff.</p>
                    </div>
                </section>

                <section className="stats-grid">
                    {stats.map((stat) => (
                        <article className="stat-card" key={stat.label}>
                            <span className="mini-label">{stat.label}</span>
                            <strong>{stat.value}</strong>
                            <p>{stat.note}</p>
                        </article>
                    ))}
                </section>

                <section className="admin-layout">
                    <div className="panel stack-md">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">Plan Management</p>
                                <h2>Subscription catalog</h2>
                            </div>
                            <button className="button button-secondary">Create New Plan</button>
                        </div>
                        <div className="plan-grid compact-grid">
                            {plans.map((plan) => (
                                <article className={`plan-card accent-${plan.accent}`} key={plan.id}>
                                    <div className="plan-topline">
                                        <span className="pill">{plan.duration}</span>
                                        <span className="price-tag">Rs {plan.price}</span>
                                    </div>
                                    <h3>{plan.name}</h3>
                                    <p>{plan.description}</p>
                                    <div className="plan-footer">
                                        <span>{plan.meals}</span>
                                        <button className="text-button">Edit Plan</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="stack-md">
                        <section className="panel">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Menu Updates</p>
                                    <h2>Weekly crowd forecast</h2>
                                </div>
                                <button className="button button-secondary">Upload Menu</button>
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
                                    <p className="eyebrow">Payments</p>
                                    <h2>Latest transactions</h2>
                                </div>
                            </div>
                            <div className="table-list">
                                {orders.slice(0, 4).map((order) => (
                                    <div className="table-row" key={order.id}>
                                        <div>
                                            <strong>{order.item}</strong>
                                            <p>{order.id}</p>
                                        </div>
                                        <span>Rs {order.amount}</span>
                                        <span className="status-tag">{order.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </section>

                <section className="panel">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Feedback Analysis</p>
                            <h2>Student sentiment</h2>
                        </div>
                    </div>
                    <div className="feedback-grid">
                        {feedbackItems.map((item) => (
                            <article className="feedback-card" key={item.id}>
                                <div className="feedback-topline">
                                    <strong>{item.student}</strong>
                                    <span>{'★'.repeat(item.rating)}</span>
                                </div>
                                <p className="feedback-meal">{item.meal}</p>
                                <p>{item.note}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
}

export default AdminPanel;
