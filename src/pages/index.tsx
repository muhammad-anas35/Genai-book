import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import WhatYouWillLearn from '@site/src/components/WhatYouWillLearn';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--5')}>
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Start Reading
              </Link>
            </div>
          </div>
          <div className={clsx('col col--7', styles.bookCover)}>
            <img src="img/coverpng.png" alt="Book Cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
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
