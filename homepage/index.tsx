import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import "../assets/styles/styles.scss";
import Head from "@docusaurus/core/lib/client/exports/Head";
import clsx from "clsx";
import Feature from "@site/repos/laravel-like-docs/homepage/feature";
import React, { JSX } from "react";
import { useMouseGlow } from '@site/src/components/useMouseGlow';
import MouseGlowOverlay from '@site/src/components/MouseGlowOverlay';
import SoftCard from '@site/src/components/softui/SoftCard';
import StatCounter from '@site/src/components/softui/StatCounter';
import SectionHeader from '@site/src/components/softui/SectionHeader';
import StepCard from '@site/src/components/softui/StepCard';
import CtaBanner from '@site/src/components/softui/CtaBanner';
import FaqAccordion from '@site/src/components/softui/FaqAccordion';
import softui from '@site/src/components/softui/softui.module.css';

const HeaderData = {
  title: "Documentation For Laravel Like Package",
  description:
    "The interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application.",
  subDescription: "We provide easy to use and can be integrated into any Laravel application. Get started with Laravel Like Package.",
  tags: ["Laravel", "Like", "Dislike", "Love", "Eloquent", "PHP"],
  startButtonLink: "/laravel-like/introduction",
  startButtonLabel: "🚀 Get Started",
};

const stats = [
  { value: 23, emoji: "📄", label: "Doc pages" },
  { value: 3, emoji: "💖", label: "Interaction types" },
  { value: 100, suffix: "%", emoji: "💚", label: "Open source" },
  { value: 3, emoji: "🚀", label: "Laravel majors supported" },
];

const quickSteps = [
  {
    step: 1,
    title: "Install via Composer",
    description: "The package registers its service provider automatically via package auto-discovery.",
    code: "composer require cslant/laravel-like",
  },
  {
    step: 2,
    title: "Publish config & migrate",
    description: "Publish config/like.php and the likes table migrations, then migrate.",
    code: 'php artisan vendor:publish --provider="CSlant\\LaravelLike\\Providers\\LikeServiceProvider"\nphp artisan migrate',
  },
  {
    step: 3,
    title: "Add the trait",
    description: "Use the provided trait on your model to enable interactions instantly.",
  },
  {
    step: 4,
    title: "Start interacting",
    description: "Like, dislike or love from anywhere — Like::like($post), isLiked(), toggle() and more.",
  },
];

const faqs = [
  {
    question: "Which PHP and Laravel versions are supported?",
    answer:
      "Laravel Like supports PHP ^8.2 (8.2 – 8.5) and Laravel 11, 12 and 13. Laravel 13 requires PHP 8.3 or newer.",
  },
  {
    question: "Is the vendor:publish step required?",
    answer:
      "Yes. It is required — it publishes config/like.php and the migrations for the likes table, including the composite lookup index.",
  },
  {
    question: "Can a user like the same model twice?",
    answer:
      "No. The package enforces a single-active invariant per user per model, enforced transactionally — calling like() again is idempotent and never duplicates rows.",
  },
  {
    question: "Which models can interact?",
    answer:
      "Any Eloquent model. Interactions use polymorphic relationships, so there is no schema coupling and no N+1 queries.",
  },
];

function HomepageHeader() {
  const { title, description, subDescription, tags, startButtonLink, startButtonLabel } = HeaderData;
  const { glow, onMouseMove, onMouseLeave } = useMouseGlow();

  return (
    <>
      <Head>
        <title>Homepage | Laravel Like Package | CSlant Documentation</title>
        <link rel="canonical" href="https://docs.cslant.com/laravel-like" />
        <meta name="description"
              content="Laravel Like package is the interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application. This package is easy to use and can be integrated into any Laravel application."
              data-rh="true" />
        <meta name="keywords"
              content="Laravel, Like, Dislike, Love, Laravel Like, Laravel Dislike, Laravel Love, Laravel Like Package"
              data-rh="true" />
        <meta name="author" content="CSlant" data-rh="true" />
        <meta name="robots" content="index, follow" data-rh="true" />
        <meta name="theme-color" content="#2e8555" data-rh="true" />
        <meta name="generator" content="Docusaurus" data-rh="true" />
        
        <meta property="og:site_name" content="Laravel Like Package Documentation" data-rh="true" />
        <meta property="og:type" content="website" data-rh="true" />
        <meta property="og:title" content="Homepage | Laravel Like Package | CSlant Documentation" data-rh="true" />
        <meta property="og:description" content="Laravel Like Package Documentation - Documentation" data-rh="true" />
        <meta property="og:url" content="https://docs.cslant.com/laravel-like" data-rh="true" />
        <meta property="og:locale" content="en_US" data-rh="true" />
        
        <meta name="twitter:card" content="summary_large_image" data-rh="true" />
        <meta name="twitter:title" content="Homepage | Laravel Like Package | CSlant Documentation" data-rh="true" />
        <meta name="twitter:description" content="Laravel Like Package Documentation - Documentation" data-rh="true" />
        <meta name="twitter:creator" content="@cslantofficial" data-rh="true" />
        <meta name="twitter:site" content="@cslantofficial" data-rh="true" />
        
        <meta name="format-detection" content="telephone=no" data-rh="true" />
        <meta name="mobile-web-app-capable" content="yes" data-rh="true" />
        <meta name="apple-mobile-web-app-capable" content="yes" data-rh="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" data-rh="true" /></Head>
      <header
        className="main_header laravel_like_header"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <MouseGlowOverlay glow={glow} color="rgba(46, 133, 85, 0.18)" />
        <div className="container">
          <div className="row">
            <div className="col col--5 left_header">
              <div className="laravel_like_badge">💖 Social Interactions for Laravel</div>
              <Heading as="h1" className="hero__title main_title">
                {title}
              </Heading>
              <p className="hero__subtitle">{description}</p>
              <p className="hero__subDescription">{subDescription}</p>
              <div className="tags_container">
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag-badge" style={{ animationDelay: `${0.5 + idx * 0.08}s` }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="buttons">
                <Link className="button button--success button--lg" to={startButtonLink}>
                  {startButtonLabel}
                </Link>
              </div>
            </div>
            <div className={clsx("col col--5")}>
              <div className="hero__image">
                <img src="/images/laravel-like-docs.webp" alt="CSlant Laravel Like Package" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function StatsBar() {
  return (
    <section className="home-page__section">
      <div className="container">
        <div className={softui.grid4}>
          {stats.map((stat, idx) => (
            <SoftCard key={idx} delay={idx * 0.1}>
              <StatCounter {...stat} delay={idx * 0.1} />
            </SoftCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  return (
    <section className="home-page__section">
      <div className="container">
        <SectionHeader
          title="Get Started in Four Steps"
          subtitle="From composer require to your first like — everything you need is below."
          accent="linear-gradient(135deg, #2e8555, #25c2a0)"
        />
        <div className={softui.grid4}>
          {quickSteps.map((step, idx) => (
            <StepCard key={idx} step={step.step} title={step.title} description={step.description} code={step.code} delay={idx * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="home-page__section">
      <div className="container">
        <SectionHeader title="Frequently Asked Questions" subtitle="Quick answers to the questions Laravel developers ask most." accent="linear-gradient(135deg, #2e8555, #25c2a0)" />
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}

export default function LaravelLikePackageHome(): JSX.Element {
  return (
    <Layout title="Home Page" description="Laravel Like Package Cslant Documentation">
      <HomepageHeader />
      <main>
        <StatsBar />
        <section className="home-page__features">
          <div className="container">
            <SectionHeader
              title="✨ Key Features"
              subtitle="Everything you need to add social interaction features to your Laravel app."
              accent="linear-gradient(135deg, #2e8555, #25c2a0)"
            />
            <Feature />
          </div>
        </section>
        <QuickStart />
        <FaqSection />
        <section className="home-page__section">
          <div className="container">
            <CtaBanner
              title="Add social interactions to your Laravel app"
              subtitle="Like, dislike and love with one package — idempotent, strict and Laravel-native."
              accent="linear-gradient(135deg, #2e8555, #25c2a0)"
              primary={{ label: "🚀 Get Started", href: "/laravel-like/introduction" }}
              secondary={{ label: "⭐ GitHub Repository", href: "https://github.com/cslant/laravel-like", external: true }}
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}