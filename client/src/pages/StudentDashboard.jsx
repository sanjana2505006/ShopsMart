function StudentDashboard({
    user,
    mealPlans,
    stats,
    bookings,
    orders,
    notifications,
    onBuyPlan,
    onToggleBooking,
    onNavigate,
}) {
    return (
        <section className="page page-dashboard">
            <div className="container stack-lg">
                <section className="hero hero-dashboard">
                    <div className="hero-copy">
                        <p className="eyebrow">Student Dashboard</p>
                        <h1>Welcome back, {user?.name}.</h1>
                        <p className="hero-text">
                            Your plan is active, tomorrow&apos;s meals are open for confirmation, and the mess committee just pushed a fresh menu update.
                        </p>
                        <div className="hero-actions">
                            <button className="button button-primary" onClick={() => onNavigate('menu')}>
                                Explore Today&apos;s Menu
                            </button>
                            <button className="button button-secondary" onClick={() => onNavigate('admin')}>
                                View Committee Insights
                            </button>
                        </div>
                    </div>
                    <div className="hero-sidecard">
                        <span className="mini-label">Subscription Status</span>
                        <strong>Monthly Non-Veg</strong>
                        <p>18 meals left, next renewal on May 2, payment auto-reminder enabled.</p>
                    </div>
                </section>

                <section className="stats-grid">
                    {stats.map((item) => (
                        <article className="stat-card" key={item.label}>
                            <span className="mini-label">{item.label}</span>
                            <strong>{item.value}</strong>
                            <p>{item.helper}</p>
                        </article>
                    ))}
                </section>

                <section className="dashboard-layout">
                    <div className="stack-md">
                        <section className="panel">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Meal Plans</p>
                                    <h2>Choose your next subscription</h2>
                                </div>
                            </div>
                            <div className="plan-grid">
                                {mealPlans.map((plan) => (
                                    <article className={`plan-card accent-${plan.accent}`} key={plan.id}>
                                        <div className="plan-topline">
                                            <span className="pill">{plan.duration}</span>
                                            <span className="price-tag">Rs {plan.price}</span>
                                        </div>
                                        <h3>{plan.name}</h3>
                                        <p>{plan.description}</p>
                                        <div className="plan-footer">
                                            <span>{plan.meals}</span>
                                            <button className="button button-secondary" onClick={() => onBuyPlan(plan)}>
                                                Buy Plan
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="panel">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Bookings</p>
                                    <h2>Tomorrow&apos;s meal opt-ins</h2>
                                </div>
                            </div>
                            <div className="booking-list">
                                {bookings.map((meal) => (
                                    <article className="booking-card" key={meal.id}>
                                        <div>
                                            <strong>{meal.title}</strong>
                                            <p>{meal.item}</p>
                                            <span>{meal.time}</span>
                                        </div>
                                        <button
                                            className={meal.booked ? 'toggle-button active' : 'toggle-button'}
                                            onClick={() => onToggleBooking(meal.id)}
                                        >
                                            {meal.booked ? 'Booked' : 'Skip'}
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="stack-md">
                        <section className="panel">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Notifications</p>
                                    <h2>Stay in sync</h2>
                                </div>
                            </div>
                            <div className="notification-list">
                                {notifications.map((item) => (
                                    <article className={`notification-card tone-${item.tone}`} key={item.id}>
                                        <strong>{item.title}</strong>
                                        <p>{item.detail}</p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="panel">
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">Transactions</p>
                                    <h2>Recent orders</h2>
                                </div>
                            </div>
                            <div className="table-list">
                                {orders.slice(0, 5).map((order) => (
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
            </div>
        </section>
    );
}

export default StudentDashboard;
