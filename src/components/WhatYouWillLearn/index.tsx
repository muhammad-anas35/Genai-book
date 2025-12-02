import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type LearnItem = {
  title: string;
  image: string;
  icon: string;
  description: ReactNode;
};

const LearnList: LearnItem[] = [
  {
    title: 'Understand Physical AI principles and embodied intelligence',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop',
    icon: '🧠',
    description: (
      <>
        Gain a deep understanding of the core concepts that are driving the next wave of AI innovation.
      </>
    ),
  },
  {
    title: 'Master ROS 2 (Robot Operating System) for robotic control',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    icon: '⚙️',
    description: (
      <>
        Learn the industry-standard middleware for building and controlling complex robotic systems.
      </>
    ),
  },
  {
    title: 'Simulate robots with Gazebo and Unity',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    icon: '🎮',
    description: (
      <>
        Get hands-on experience with powerful simulation tools to design, test, and validate your robotic systems.
      </>
    ),
  },
  {
    title: 'Develop with the NVIDIA Isaac AI robot platform',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    icon: '🚀',
    description: (
      <>
        Leverage the power of NVIDIA's advanced AI platform to build and deploy high-performance robots.
      </>
    ),
  },
  {
    title: 'Design humanoid robots for natural interactions',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    icon: '🤖',
    description: (
      <>
        Explore the challenges and opportunities of designing robots that can interact with humans in a natural and intuitive way.
      </>
    ),
  },
  {
    title: 'Integrate GPT models for conversational robotics',
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800&h=600&fit=crop',
    icon: '💬',
    description: (
      <>
        Learn how to combine the power of large language models with robotics to create conversational and intelligent robots.
      </>
    ),
  },
];

function Learn({ title, image, icon, description }: LearnItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card card--full-height', styles.learnCard)}>
        <div className={styles.learnImage}>
          <img src={image} alt={title} />
          <div className={styles.learnIcon}>{icon}</div>
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

export default function WhatYouWillLearn(): ReactNode {
  return (
    <section className={styles.learn}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" className={styles.sectionTitle}>What You Will Learn</Heading>
          <p className={styles.sectionSubtitle}>Master cutting-edge technologies in Physical AI and Humanoid Robotics</p>
        </div>
        <div className="row">
          {LearnList.map((props, idx) => (
            <Learn key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
