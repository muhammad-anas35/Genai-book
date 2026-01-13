import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './auth.module.css';
import { API_BASE_URL } from '../lib/api';

interface UserBackground {
    softwareBackground?: string;
    hardwareBackground?: string;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    primaryInterest?: string;
    learningGoals?: string[];
}

export default function Signup(): React.ReactNode {
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
            const res = await fetch(`${API_BASE_URL}/api/auth/signup/email`, {
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
                </div>
            </div>
        </Layout>
    );
}
