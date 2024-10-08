import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import "./styles.scss";
import Head from "@docusaurus/core/lib/client/exports/Head";

const HeaderData = {
  title: "Documentation For Laravel Like Package",
  description:
    "The interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application.",
  startButtonLink: "/laravel-like/introduction",
  startButtonLabel: "Get Started",
};

function HomepageHeader() {
  const { title, description, startButtonLink, startButtonLabel } = HeaderData;
  
  return (
    <>
      <Head>
        <title>Homepage | Laravel Like Package | CSlant Documentation</title>
        <link rel="canonical" href="https://docs.cslant.com/laravel-like/" />
        <meta name="description"
              content="Laravel Like package is the interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application. This package is easy to use and can be integrated into any Laravel application."
              data-rh="true" />
        <meta name="keywords"
              content="Laravel, Like, Dislike, Love, Laravel Like, Laravel Dislike, Laravel Love, Laravel Like Package"
              data-rh="true" />
        <meta name="author" content="CSlant" data-rh="true" />
        <meta name="robots" content="index, follow" data-rh="true" />
        <meta property="og:site_name" content="Laravel Like Package Documentation" data-rh="true" />
        <meta property="og:type" content="website" data-rh="true" />
        <meta property="og:title" content="Laravel Like Package Documentation" data-rh="true" />
        <meta property="og:description"
              content="Laravel Like package is the interaction for User 👍 like, 👎 dislike, and love ❤️ features for Laravel Application. This package is easy to use and can be integrated into any Laravel application."
              data-rh="true" />
        <meta property="og:url" content="https://docs.cslant.com/laravel-like/" data-rh="true" />
      </Head>
      <header className="main_header">
        <div className="container">
          <div className="row">
            <div className="col col--5 left_header">
              <Heading as="h1" className="hero__title main_title">
                {title}
              </Heading>
              <p className="hero__subtitle">{description}</p>
              <div className="buttons">
                <Link className="button button--info button--lg" to={startButtonLink}>
                  {startButtonLabel}
                </Link>
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
    <Layout title="Home Page" description="Telegram Git Notifier Documentation"> <HomepageHeader />
      <main>
        <section className="home-page__features">
          <div className="container">
            <div className="row home-page__container"></div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
