import { useState } from 'react';

const demoAccounts = [
    { label: 'Student Demo', email: 'riya@college.edu', password: 'smartshop123' },
    { label: 'Admin Demo', email: 'admin.mess@college.edu', password: 'committee123' },
];

function Login({ onLogin }) {
    const [email, setEmail] = useState('riya@college.edu');
    const [password, setPassword] = useState('smartshop123');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Use your campus email and password to continue.');
            return;
        }

        const role = email.includes('admin') ? 'admin' : 'student';
        const name = email.split('@')[0].replace(/[._-]/g, ' ');

        onLogin({
            email,
            role,
            name: name.replace(/\b\w/g, (char) => char.toUpperCase()),
        });
    };

    const fillDemo = (account) => {
        setEmail(account.email);
        setPassword(account.password);
        setError('');
    };

    return (
        <section className="page page-login">
            <div className="container login-layout">
                <div className="hero-card">
                    <p className="eyebrow">SmartShop</p>
                    <h1>Mess subscriptions, meal booking, and campus feedback in one clean flow.</h1>
                    <p className="hero-text">
                        Built for students who want faster checkout, clearer menus, and fewer surprises at meal time.
                    </p>

                    <div className="feature-ribbon">
                        <span>Plan checkout</span>
                        <span>Meal opt-outs</span>
                        <span>Daily menu board</span>
                        <span>Admin analytics</span>
                    </div>

                    <div className="hero-metrics">
                        <article>
                            <strong>842</strong>
                            <span>Active plans</span>
                        </article>
                        <article>
                            <strong>4.3/5</strong>
                            <span>Average meal rating</span>
                        </article>
                        <article>
                            <strong>31%</strong>
                            <span>Waste reduction with opt-ins</span>
                        </article>
                    </div>
                </div>

                <div className="login-card">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Campus Access</p>
                            <h2>Sign in</h2>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label className="input-group">
                            <span>College email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="name@college.edu"
                            />
                        </label>

                        <label className="input-group">
                            <span>Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                            />
                        </label>

                        {error ? <p className="form-error">{error}</p> : null}

                        <button className="button button-primary button-block" type="submit">
                            Continue to SmartShop
                        </button>
                    </form>

                    <div className="demo-list">
                        {demoAccounts.map((account) => (
                            <button
                                className="demo-card"
                                key={account.email}
                                type="button"
                                onClick={() => fillDemo(account)}
                            >
                                <strong>{account.label}</strong>
                                <span>{account.email}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
