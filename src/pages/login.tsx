import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './auth.module.css';

export default function Login(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signin/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                // Check if there's a stored redirect path
                const redirectPath = sessionStorage.getItem('redirectAfterLogin');
                sessionStorage.removeItem('redirectAfterLogin');

                // Redirect to stored path or home page
                window.location.href = redirectPath || '/';
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            title="Login"
            description="Login to access your Physical AI chatbot">
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <h1 className={styles.authTitle}>Welcome Back</h1>
                        <p className={styles.authSubtitle}>
                            Login to continue learning Physical AI & Humanoid Robotics
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.formInput}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.formLabel}>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.formInput}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <div className={styles.formOptions}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} />
                                <span>Remember me</span>
                            </label>
                            <Link to="#" className={styles.forgotPassword}>
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className={styles.authLink}>
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
