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

const HeaderData = {
  title: "Documentation For Laravel Like Package",
  description:
    "The interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application.",
  subDescription: "We provide easy to use and can be integrated into any Laravel application. Get started with Laravel Like Package.",
  tags: ["Laravel", "Like", "Dislike", "Love", "Eloquent", "PHP"],
  startButtonLink: "/laravel-like/introduction",
  startButtonLabel: "🚀 Get Started",
};

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

export default function LaravelLikePackageHome(): JSX.Element {
  return (
    <Layout title="Home Page" description="Laravel Like Package Cslant Documentation">
      <HomepageHeader />
      <main>
        <section className="home-page__features">
          <div className="container">
            <hr className="section-divider" />
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 className="section-title-fancy" style={{
                background: 'linear-gradient(135deg, #2e8555, #25c2a0)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ✨ Key Features
              </h2>
              <p className="section-subtitle-fancy">
                Everything you need to add social interaction features to your Laravel app.
              </p>
            </div>
            <div className="row home-page__container">
              <Feature/>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
