import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import "./styles.scss";

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
