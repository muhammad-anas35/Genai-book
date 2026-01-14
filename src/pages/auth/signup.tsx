import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './auth.module.css';

export default function SignUp(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    // Mock sign up process
    setTimeout(() => {
      alert(`Mock sign up for ${email}. In a real implementation, this would create a new user account.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout title="Sign Up" description="Create a new account">
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <h1>Sign Up</h1>
          <p>Create a new account to access additional features.</p>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="signup-email">Email</label>
              <input
                type="email"
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              Already have an account?{' '}
              <a href="/auth/signin">Sign in</a>
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