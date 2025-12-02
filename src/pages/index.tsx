import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import WhatYouWillLearn from '@site/src/components/WhatYouWillLearn';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--6', styles.heroContent)}>
            <div className={styles.heroLabel}>Physical AI & Humanoid Robotics</div>
            <Heading as="h1" className={styles.heroTitle}>
              Physical AI And Humanoid Robotics
              <br />
              For Smart Systems
            </Heading>
            <p className={styles.heroSubtitle}>
              Master the cutting-edge technologies powering the next generation of intelligent robots.
              Learn ROS 2, simulation, NVIDIA Isaac, and conversational AI to build humanoid robots
              that interact naturally with the physical world.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Start Reading
              </Link>
            </div>
          </div>
          <div className={clsx('col col--6', styles.bookCover)}>
            <img src="img/book-cover.png" alt="Book Cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A textbook on Physical AI and Humanoid Robotics by Panaversity">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <WhatYouWillLearn />
      </main>
    </Layout>
  );
}
