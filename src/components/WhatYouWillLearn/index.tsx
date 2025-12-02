import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type LearnItem = {
  title: string;
  description: ReactNode;
};

const LearnList: LearnItem[] = [
  {
    title: 'Understand Physical AI principles and embodied intelligence',
    description: (
      <>
        Gain a deep understanding of the core concepts that are driving the next wave of AI innovation.
      </>
    ),
  },
  {
    title: 'Master ROS 2 (Robot Operating System) for robotic control',
    description: (
      <>
        Learn the industry-standard middleware for building and controlling complex robotic systems.
      </>
    ),
  },
  {
    title: 'Simulate robots with Gazebo and Unity',
    description: (
      <>
        Get hands-on experience with powerful simulation tools to design, test, and validate your robotic systems.
      </>
    ),
  },
  {
    title: 'Develop with the NVIDIA Isaac AI robot platform',
    description: (
      <>
        Leverage the power of NVIDIA's advanced AI platform to build and deploy high-performance robots.
      </>
    ),
  },
  {
    title: 'Design humanoid robots for natural interactions',
    description: (
      <>
        Explore the challenges and opportunities of designing robots that can interact with humans in a natural and intuitive way.
      </>
    ),
  },
  {
    title: 'Integrate GPT models for conversational robotics',
    description: (
      <>
        Learn how to combine the power of large language models with robotics to create conversational and intelligent robots.
      </>
    ),
  },
];

function Learn({title, description}: LearnItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card card--full-height', styles.learnCard)}>
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
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">What You Will Learn</Heading>
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
