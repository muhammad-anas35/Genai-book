import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Foundations of Physical AI',
    description: (
      <>
        Explore the core principles of embodied intelligence and learn how AI is moving beyond the digital world to interact with physical reality.
      </>
    ),
  },
  {
    title: 'Humanoid Robotics in Depth',
    description: (
      <>
        Discover the past, present, and future of humanoid robots. Understand their design, mechanics, and the role they will play in our society.
      </>
    ),
  },
  {
    title: 'Hands-On with Simulation',
    description: (
      <>
        Master the tools of the trade. Learn to design, build, and test robots in realistic simulated environments using Gazebo and NVIDIA Isaac Sim.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card card--full-height', styles.featureCard)}>
        <div className="card__header">
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
