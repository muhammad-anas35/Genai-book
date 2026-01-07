import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Foundations of Physical AI',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    description: (
      <>
        Explore the core principles of embodied intelligence and learn how AI is moving beyond the digital world to interact with physical reality.
      </>
    ),
  },
  {
    title: 'Humanoid Robotics in Depth',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    description: (
      <>
        Discover the past, present, and future of humanoid robots. Understand their design, mechanics, and the role they will play in our society.
      </>
    ),
  },
  {
    title: 'Hands-On with Simulation',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
    description: (
      <>
        Master the tools of the trade. Learn to design, build, and test robots in realistic simulated environments using Gazebo and NVIDIA Isaac Sim.
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card card--full-height', styles.featureCard)}>
        <div className={styles.featureImage}>
          <img src={image} alt={title} />
        </div>
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
