import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './auth.module.css';

export default function SignUp(): JSX.Element {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Experience & Goals
  const [codingLevel, setCodingLevel] = useState('beginner');
  const [roboticsKnowledge, setRoboticsKnowledge] = useState('');
  const [learningGoal, setLearningGoal] = useState('');

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      name,
      email,
      codingLevel,
      roboticsKnowledge,
      learningGoal
    };

    // Mock API call
    setTimeout(() => {
      console.log('Final Registration Data:', userData);
      alert(`🎉 Registration Complete!\n\nWelcome, ${name}!\nWe have customized the book for your ${codingLevel} level.`);
      setLoading(false);
      // Redirect logic would go here
    }, 1500);
  };

  return (
    <Layout title="Sign Up" description="Create a new account">
      <div className={styles.authPage}>
        <div className={styles.authContainer} style={{ maxWidth: '600px' }}>
          
          {/* Progress Indicator */}
          <div className={styles.stepper}>
            {/* Step 1 */}
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
              <div className={styles.circle}>
                {step > 1 ? '✓' : '1'}
              </div>
              <div className={styles.label}>Account</div>
            </div>

            {/* Line 1-2 */}
            <div className={`${styles.line} ${step >= 2 ? styles.lineActive : ''}`}></div>

            {/* Step 2 */}
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
              <div className={styles.circle}>
                {step > 2 ? '✓' : '2'}
              </div>
              <div className={styles.label}>Profile</div>
            </div>

            {/* Line 2-3 */}
            <div className={`${styles.line} ${step >= 3 ? styles.lineActive : ''}`}></div>

            {/* Step 3 */}
            <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
              <div className={styles.circle}>3</div>
              <div className={styles.label}>Review</div>
            </div>
          </div>

          <h1>
            {step === 1 && 'Create Account'}
            {step === 2 && 'Your Profile'}
            {step === 3 && 'Review & Confirm'}
          </h1>
          
          <p style={{ marginBottom: '20px' }}>
            {step === 1 && 'Let\'s get started with your login details.'}
            {step === 2 && 'Tell us about your background so we can tailor the content.'}
            {step === 3 && 'Please check your details before finishing.'}
          </p>

          <form onSubmit={step === 3 ? handleSubmit : nextStep} className={styles.authForm}>
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
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
                    placeholder="Create a strong password"
                    minLength={6}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat your password"
                  />
                </div>
              </>
            )}

            {/* STEP 2: Profile Info */}
            {step === 2 && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="coding-level">Current Experience Level</label>
                  <select
                    id="coding-level"
                    value={codingLevel}
                    onChange={(e) => setCodingLevel(e.target.value)}
                    className={styles.selectInput}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="beginner">Beginner (New to Coding/AI)</option>
                    <option value="intermediate">Intermediate (Some Python/ROS experience)</option>
                    <option value="advanced">Advanced (Professional Developer)</option>
                    <option value="researcher">Researcher / Academic</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="robotics-knowledge">Robotics & Coding Background</label>
                  <textarea
                    id="robotics-knowledge"
                    value={roboticsKnowledge}
                    onChange={(e) => setRoboticsKnowledge(e.target.value)}
                    placeholder="Briefly describe your experience..."
                    rows={3}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="learning-goal">Primary Learning Goal</label>
                  <textarea
                    id="learning-goal"
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    required
                    placeholder="What do you want to build or achieve?"
                    rows={3}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div style={{ background: 'var(--ifm-color-emphasis-100)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0 }}>Account Summary</h3>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                
                <h3 style={{ marginTop: '1rem' }}>Profile</h3>
                <p><strong>Level:</strong> {codingLevel.charAt(0).toUpperCase() + codingLevel.slice(1)}</p>
                <p><strong>Goal:</strong> {learningGoal || "Not specified"}</p>
                
                <p style={{ fontSize: '0.9em', color: '#666', marginTop: '1rem' }}>
                  By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className={styles.submitButton}
                  style={{ background: '#666', flex: 1 }}
                  disabled={loading}
                >
                  Back
                </button>
              )}
              
              <button 
                type="submit" 
                className={styles.submitButton}
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (step === 3 ? 'Create Account' : 'Next Step →')}
              </button>
            </div>

          </form>

          {/* Footer Link (only on step 1 to keep it clean) */}
          {step === 1 && (
            <div className={styles.authFooter}>
              <p>
                Already have an account?{' '}
                <a href="/auth/signin">Sign in</a>
              </p>
              <p>
                <a href="/">Back to home</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}