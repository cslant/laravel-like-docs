import React, { JSX } from 'react';
import SoftCard from '@site/src/components/softui/SoftCard';
import softui from '@site/src/components/softui/softui.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    emoji: '✨',
    description:
      'Install via Composer, add the trait and start liking — automatic service provider registration, minimal setup.',
  },
  {
    title: 'Multiple Interaction Types',
    emoji: '💖',
    description:
      'Like, dislike and love out of the box, or extend to your own interaction types with the config.',
  },
  {
    title: 'Polymorphic & Eloquent-native',
    emoji: '🧩',
    description:
      'Works with any Eloquent model through polymorphic relationships — no schema coupling.',
  },
  {
    title: 'Idempotent by Design',
    emoji: '🛡️',
    description:
      'Single-active invariant per user per model, enforced transactionally. Calling like() twice never duplicates.',
  },
  {
    title: 'Strict Counting',
    emoji: '⚡',
    description:
      'Single COUNT / EXISTS queries, batch APIs for whole collections, and optional config-driven caching.',
  },
  {
    title: 'UUID Support',
    emoji: '🆔',
    description:
      'Switch to UUID primary keys with a single config flag — perfect for distributed and sync-heavy apps.',
  },
];

export default function Feature(): JSX.Element {
  return (
    <div className={softui.grid3}>
      {FeatureList.map((feature, idx) => (
        <SoftCard key={idx} delay={idx * 0.1}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>{feature.emoji}</div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{feature.title}</h3>
          <p className="m-0">{feature.description}</p>
        </SoftCard>
      ))}
    </div>
  );
}