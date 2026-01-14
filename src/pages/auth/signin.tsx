import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './auth.module.css';

export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock sign in process
    setTimeout(() => {
      alert(`Mock sign in for ${email}. In a real implementation, this would authenticate the user.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout title="Sign In" description="Sign in to your account">
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <h1>Sign In</h1>
          <p>Welcome back! Please sign in to your account.</p>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              Don't have an account?{' '}
              <a href="/auth/signup">Sign up</a>
            </p>
            <p>
              <a href="/">Back to home</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}