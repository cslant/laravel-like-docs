import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import "../assets/styles/styles.scss";
import Head from "@docusaurus/core/lib/client/exports/Head";
import clsx from "clsx";
import Feature from "@site/repos/laravel-like-docs/homepage/feature";
import { JSX } from "react";

const HeaderData = {
  title: "Documentation For Laravel Like Package",
  description:
    "The interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application.",
  subDescription: "We provide easy to use and can be integrated into any Laravel application. Get started with Laravel Like Package.",
  startButtonLink: "/laravel-like/introduction",
  startButtonLabel: "Get Started",
};

function HomepageHeader() {
  const { title, description, subDescription, startButtonLink, startButtonLabel } = HeaderData;
  
  return (
    <>
      <Head>
        <title>Homepage | Laravel Like Package | CSlant Documentation</title>
        <link rel="canonical" href="https://docs.cslant.com/laravel-like" />
        <meta name="description"
              content="Laravel Like package is the interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application. This package is easy to use and can be integrated into any Laravel application."
              data-rh="true" />

        <meta name="author" content="CSlant" data-rh="true" />
        <meta name="robots" content="index, follow" data-rh="true" />
        <meta property="og:site_name" content="Laravel Like Package Documentation" data-rh="true" />
        <meta property="og:type" content="website" data-rh="true" />
        <meta property="og:title" content="Laravel Like Package Documentation" data-rh="true" />
        <meta property="og:description"
              content="Laravel Like package is the interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application. This package is easy to use and can be integrated into any Laravel application."
              data-rh="true" />
        <meta property="og:url" content="https://docs.cslant.com/laravel-like" data-rh="true" />
        <meta data-rh="true" property="og:image" content="/images/laravel-like-docs-thumb.webp" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" data-rh="true" />
        <meta name="twitter:title" content="Laravel Like Package Documentation" data-rh="true" />
        <meta name="twitter:description" content="Laravel Like package is the interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application. This package is easy to use and can be integrated into any Laravel application." data-rh="true" />
        <meta data-rh="true" name="twitter:image" content="/images/laravel-like-docs-thumb.webp" />
      </Head>
      <header className="main_header laravel_like_header">
        <div className="container">
          <div className="row">
            <div className="col col--5 left_header">
              <Heading as="h1" className="hero__title main_title">
                {title}
              </Heading>
              <p className="hero__subtitle">{description}</p>
              <p className="hero__subDescription">{subDescription}</p>
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
            <hr style={{ margin: "2rem 0", border: "0.5px solid #eaecef" }} />
            <div className="row home-page__container">
              <Feature/>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
