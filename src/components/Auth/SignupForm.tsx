import React, { useState } from 'react';
import './AuthForm.css';

interface UserBackground {
  softwareBackground?: string;
  hardwareBackground?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  primaryInterest?: string;
  learningGoals?: string[];
}

interface SignupFormData {
  email: string;
  password: string;
  name: string;
  userBackground: UserBackground;
}

/**
 * Signup form with user background questions
 */
export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    name: '',
    userBackground: {
      softwareBackground: '',
      hardwareBackground: '',
      experienceLevel: 'beginner',
      primaryInterest: '',
      learningGoals: [''],
    }
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 3; // Personal info, background, confirm

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackgroundChange = (field: keyof UserBackground, value: any) => {
    setFormData(prev => ({
      ...prev,
      userBackground: {
        ...prev.userBackground,
        [field]: value
      }
    }));
  };

  const handleLearningGoalChange = (index: number, value: string) => {
    const newGoals = [...formData.userBackground.learningGoals!];
    newGoals[index] = value;
    handleBackgroundChange('learningGoals', newGoals);
  };

  const addLearningGoal = () => {
    handleBackgroundChange('learningGoals', [...formData.userBackground.learningGoals!, '']);
  };

  const removeLearningGoal = (index: number) => {
    const newGoals = formData.userBackground.learningGoals!.filter((_, i) => i !== index);
    handleBackgroundChange('learningGoals', newGoals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Redirect on success
      window.location.href = data.redirect || '/';
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <p className="auth-subtitle">Tell us about yourself to personalize your learning experience</p>

        {/* Progress indicator */}
        <div className="progress-bar">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`progress-step ${i + 1 <= currentStep ? 'active' : ''} ${i + 1 < currentStep ? 'completed' : ''}`}
            >
              <span>{i + 1}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Create a password (min 8 characters)"
                />
              </div>
            </div>
          )}

          {/* Step 2: Background Information */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Tell Us About Your Background</h3>
              <p className="form-help">This helps us personalize your learning experience</p>

              <div className="form-group">
                <label htmlFor="softwareBackground">Software Background</label>
                <textarea
                  id="softwareBackground"
                  name="softwareBackground"
                  value={formData.userBackground.softwareBackground}
                  onChange={(e) => handleBackgroundChange('softwareBackground', e.target.value)}
                  placeholder="e.g., Programming languages you know, development experience, etc."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hardwareBackground">Hardware Background</label>
                <textarea
                  id="hardwareBackground"
                  name="hardwareBackground"
                  value={formData.userBackground.hardwareBackground}
                  onChange={(e) => handleBackgroundChange('hardwareBackground', e.target.value)}
                  placeholder="e.g., Electronics experience, robotics projects, etc."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="experienceLevel">Experience Level</label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.userBackground.experienceLevel}
                  onChange={(e) => handleBackgroundChange('experienceLevel', e.target.value as any)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="primaryInterest">Primary Interest in Physical AI & Robotics</label>
                <input
                  type="text"
                  id="primaryInterest"
                  name="primaryInterest"
                  value={formData.userBackground.primaryInterest}
                  onChange={(e) => handleBackgroundChange('primaryInterest', e.target.value)}
                  placeholder="What aspect interests you most?"
                />
              </div>

              <div className="form-group">
                <label>Learning Goals</label>
                {formData.userBackground.learningGoals!.map((goal, index) => (
                  <div key={index} className="goal-input-group">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => handleLearningGoalChange(index, e.target.value)}
                      placeholder={`Learning goal ${index + 1}`}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-goal-btn"
                        onClick={() => removeLearningGoal(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-goal-btn"
                  onClick={addLearningGoal}
                >
                  + Add Another Goal
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Confirm Your Information</h3>
              <p className="form-help">Review your details before creating your account</p>

              <div className="summary-section">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
              </div>

              <div className="summary-section">
                <h4>Background Information</h4>
                <p><strong>Software Background:</strong> {formData.userBackground.softwareBackground || 'Not provided'}</p>
                <p><strong>Hardware Background:</strong> {formData.userBackground.hardwareBackground || 'Not provided'}</p>
                <p><strong>Experience Level:</strong> {formData.userBackground.experienceLevel}</p>
                <p><strong>Primary Interest:</strong> {formData.userBackground.primaryInterest || 'Not provided'}</p>

                <div>
                  <strong>Learning Goals:</strong>
                  <ul>
                    {formData.userBackground.learningGoals?.filter(goal => goal.trim()).map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                Previous
              </button>
            )}

            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}