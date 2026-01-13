import { type ReactNode, useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import WhatYouWillLearn from '../components/WhatYouWillLearn';
import { API_BASE_URL } from '../lib/api';

export default function Home(): ReactNode {
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check`);
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Failed to check authentication:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      history.push('/docs/intro');
    } else {
      history.push('/login');
    }
  };

  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Master the cutting-edge technologies powering the next generation of intelligent robots">
      <div className={styles.heroBanner}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <p className={styles.heroLabel}>PHYSICAL AI & HUMANOID ROBOTICS</p>
            <h1 className={styles.heroTitle}>Physical AI And Humanoid Robotics</h1>
            <p className={styles.heroAuthor}>By Muhammad Anas Asif</p>
            <p className={styles.heroDescription}>
              Master the cutting-edge technologies powering the next generation of intelligent robots.
              Learn ROS 2, simulation, NVIDIA Isaac, and conversational AI to build humanoid robots
              that interact naturally with the physical world.
            </p>

            <div className={styles.buttonsSection}>
              <button className={`${styles.button} ${styles.primaryBtn}`} onClick={handleGetStarted}>
                Start Reading
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.buttonIcon}
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <img
              src="/img/book-cover.png"
              alt="Physical AI Book Cover"
              className={styles.robotImage}
            />
          </div>
        </div>
      </div>

      <HomepageFeatures />
      <WhatYouWillLearn />
    </Layout>
  );
}
