import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './auth.module.css';

interface UserBackground {
    softwareBackground?: string;
    hardwareBackground?: string;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    primaryInterest?: string;
    learningGoals?: string[];
}

export default function Signup(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [userBackground, setUserBackground] = useState<UserBackground>({
        softwareBackground: '',
        hardwareBackground: '',
        experienceLevel: 'beginner',
        primaryInterest: '',
        learningGoals: [''],
    });
    const [currentStep, setCurrentStep] = useState<number>(1); // 1: Personal info, 2: Background, 3: Confirm
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBackgroundChange = (field: keyof UserBackground, value: any) => {
        setUserBackground(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLearningGoalChange = (index: number, value: string) => {
        const newGoals = [...userBackground.learningGoals!];
        newGoals[index] = value;
        handleBackgroundChange('learningGoals', newGoals);
    };

    const addLearningGoal = () => {
        handleBackgroundChange('learningGoals', [...userBackground.learningGoals!, '']);
    };

    const removeLearningGoal = (index: number) => {
        if (userBackground.learningGoals!.length <= 1) return;
        const newGoals = userBackground.learningGoals!.filter((_, i) => i !== index);
        handleBackgroundChange('learningGoals', newGoals);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (currentStep < 3) {
            // Move to next step instead of submitting
            setCurrentStep(prev => Math.min(prev + 1, 3));
            return;
        }

        // Final validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    userBackground, // Include user background in the request
                }),
            });

            if (res.ok) {
                // Redirect to login with success message
                window.location.href = '/login?registered=true';
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create account');
            }
        } catch (err) {
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            title="Sign Up"
            description="Create an account to access your Physical AI chatbot">
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <h1 className={styles.authTitle}>Create Account</h1>
                        <p className={styles.authSubtitle}>
                            Start your journey in Physical AI & Humanoid Robotics
                        </p>

                        {/* Progress indicator */}
                        <div className={styles.progressBar}>
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.progressStep} ${i + 1 <= currentStep ? styles.active : ''} ${i + 1 < currentStep ? styles.completed : ''}`}
                                >
                                    <span>{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <>
                                <h2 className={styles.stepTitle}>Personal Information</h2>

                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.formLabel}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="John Doe"
                                        required
                                        autoComplete="name"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.formLabel}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="new-password"
                                        minLength={8}
                                    />
                                    <span className={styles.formHint}>
                                        Must be at least 8 characters
                                    </span>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="confirmPassword" className={styles.formLabel}>
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={styles.formInput}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className={styles.formOptions}>
                                    <label className={styles.checkboxLabel}>
                                        <input type="checkbox" className={styles.checkbox} required />
                                        <span>
                                            I agree to the{' '}
                                            <Link to="#" className={styles.inlineLink}>
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link to="#" className={styles.inlineLink}>
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>
                                </div>
                            </>
                        )}

                        {/* Step 2: Background Information */}
                        {currentStep === 2 && (
                            <>
                                <h2 className={styles.stepTitle}>Tell Us About Your Background</h2>
                                <p className={styles.stepSubtitle}>This helps us personalize your learning experience</p>

                                <div className={styles.formGroup}>
                                    <label htmlFor="softwareBackground" className={styles.formLabel}>
                                        Software Background
                                    </label>
                                    <textarea
                                        id="softwareBackground"
                                        value={userBackground.softwareBackground}
                                        onChange={(e) => handleBackgroundChange('softwareBackground', e.target.value)}
                                        className={styles.formTextarea}
                                        placeholder="e.g., Programming languages you know, development experience, etc."
                                        rows={3}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="hardwareBackground" className={styles.formLabel}>
                                        Hardware Background
                                    </label>
                                    <textarea
                                        id="hardwareBackground"
                                        value={userBackground.hardwareBackground}
                                        onChange={(e) => handleBackgroundChange('hardwareBackground', e.target.value)}
                                        className={styles.formTextarea}
                                        placeholder="e.g., Electronics experience, robotics projects, etc."
                                        rows={3}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="experienceLevel" className={styles.formLabel}>
                                        Experience Level
                                    </label>
                                    <select
                                        id="experienceLevel"
                                        value={userBackground.experienceLevel}
                                        onChange={(e) => handleBackgroundChange('experienceLevel', e.target.value as any)}
                                        className={styles.formSelect}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="primaryInterest" className={styles.formLabel}>
                                        Primary Interest in Physical AI & Robotics
                                    </label>
                                    <input
                                        type="text"
                                        id="primaryInterest"
                                        value={userBackground.primaryInterest}
                                        onChange={(e) => handleBackgroundChange('primaryInterest', e.target.value)}
                                        className={styles.formInput}
                                        placeholder="What aspect interests you most?"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Learning Goals</label>
                                    {userBackground.learningGoals?.map((goal, index) => (
                                        <div key={index} className={styles.goalInputGroup}>
                                            <input
                                                type="text"
                                                value={goal}
                                                onChange={(e) => handleLearningGoalChange(index, e.target.value)}
                                                className={styles.formInput}
                                                placeholder={`Learning goal ${index + 1}`}
                                            />
                                            {userBackground.learningGoals!.length > 1 && (
                                                <button
                                                    type="button"
                                                    className={styles.removeGoalBtn}
                                                    onClick={() => removeLearningGoal(index)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className={styles.addGoalBtn}
                                        onClick={addLearningGoal}
                                    >
                                        + Add Another Goal
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Confirmation */}
                        {currentStep === 3 && (
                            <>
                                <h2 className={styles.stepTitle}>Confirm Your Information</h2>
                                <p className={styles.stepSubtitle}>Review your details before creating your account</p>

                                <div className={styles.summarySection}>
                                    <h3>Personal Information</h3>
                                    <p><strong>Name:</strong> {formData.name}</p>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                </div>

                                <div className={styles.summarySection}>
                                    <h3>Background Information</h3>
                                    <p><strong>Software Background:</strong> {userBackground.softwareBackground || 'Not provided'}</p>
                                    <p><strong>Hardware Background:</strong> {userBackground.hardwareBackground || 'Not provided'}</p>
                                    <p><strong>Experience Level:</strong> {userBackground.experienceLevel}</p>
                                    <p><strong>Primary Interest:</strong> {userBackground.primaryInterest || 'Not provided'}</p>

                                    <div>
                                        <strong>Learning Goals:</strong>
                                        <ul>
                                            {userBackground.learningGoals?.filter(goal => goal.trim()).map((goal, index) => (
                                                <li key={index}>{goal}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className={styles.formNavigation}>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    className={styles.navButton}
                                    onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                                >
                                    Previous
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    className={styles.submitButton}
                                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, 3))}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className={styles.authFooter}>
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className={styles.authLink}>
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button className={styles.socialButton}>
                            <svg className={styles.socialIcon} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                        <button className={styles.socialButton}>
                            <svg className={styles.socialIcon} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
