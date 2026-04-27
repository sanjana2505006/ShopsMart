import { useState } from 'react';

const demoAccounts = [
    { label: 'Student Demo', email: 'riya@college.edu', password: 'smartshop123', role: 'student', mode: 'login' },
    { label: 'Admin Demo', email: 'admin.mess@college.edu', password: 'committee123', role: 'admin', mode: 'login' },
];

const initialForm = {
    name: '',
    email: 'riya@college.edu',
    password: 'smartshop123',
    role: 'student',
};

function Login({ onAuthSuccess }) {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
            setError('Complete the required fields to continue.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'signup'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to continue.');
            }

            setMessage(mode === 'signup' ? 'Account created. Welcome to SmartShop.' : 'Signed in successfully.');
            onAuthSuccess(data);
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fillDemo = (account) => {
        setMode(account.mode);
        setForm({
            name: account.role === 'admin' ? 'Mess Admin' : 'Riya Sharma',
            email: account.email,
            password: account.password,
            role: account.role,
        });
        setError('');
        setMessage(`${account.label} loaded. You can sign in right away.`);
    };

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setError('');
        setMessage('');
    };

    return (
        <section className="page page-login">
            <div className="container login-layout">
                <div className="hero-card">
                    <p className="eyebrow">SmartShop</p>
                    <h1>Mess plans and meal booking, made simple.</h1>
                    <p className="hero-text">Fast access for students and the mess committee.</p>

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
                            <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
                        </div>
                    </div>

                    <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
                        <button
                            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
                            type="button"
                            onClick={() => switchMode('login')}
                        >
                            Login
                        </button>
                        <button
                            className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
                            type="button"
                            onClick={() => switchMode('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {mode === 'signup' ? (
                            <label className="input-group">
                                <span>Full name</span>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) => updateField('name', event.target.value)}
                                    placeholder="Your full name"
                                />
                            </label>
                        ) : null}

                        <label className="input-group">
                            <span>College email</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(event) => updateField('email', event.target.value)}
                                placeholder="name@college.edu"
                            />
                        </label>

                        <label className="input-group">
                            <span>Password</span>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(event) => updateField('password', event.target.value)}
                                placeholder={mode === 'signup' ? 'Use at least 8 characters' : 'Enter your password'}
                            />
                        </label>

                        {mode === 'signup' ? (
                            <div className="role-picker">
                                <button
                                    className={form.role === 'student' ? 'role-card active' : 'role-card'}
                                    type="button"
                                    onClick={() => updateField('role', 'student')}
                                >
                                    <strong>Student</strong>
                                    <span>Subscribe to plans, book meals, and track orders.</span>
                                </button>
                                <button
                                    className={form.role === 'admin' ? 'role-card active' : 'role-card'}
                                    type="button"
                                    onClick={() => updateField('role', 'admin')}
                                >
                                    <strong>Mess Committee</strong>
                                    <span>Manage plans, menu updates, and student feedback.</span>
                                </button>
                            </div>
                        ) : null}

                        {error ? <p className="form-error">{error}</p> : null}
                        {message ? <p className="form-success">{message}</p> : null}

                        <button className="button button-primary button-block" type="submit">
                            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Continue to SmartShop' : 'Create SmartShop Account'}
                        </button>
                    </form>

                    <p className="auth-hint">
                        Demo accounts are ready. New sign-ups are saved automatically.
                    </p>

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
