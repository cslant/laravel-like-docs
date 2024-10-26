import React from "react";
import "../../assets/styles/feature/style.scss";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    description: (
      <>
        You can easily integrate this package into your Laravel application. The package is designed to be user-friendly and requires minimal setup.
      </>
    ),
  },
  {
    title: "Advanced Customization",
    description: (
      <>
        Customize the package to suit your needs. You can configure the package to work with different types of interactions and events.
      </>
    ),
  },
  {
    title: "Multiple Interaction Types",
    description: (
      <>
        The package supports various interaction types, including likes, dislikes, and loves. Or you can create your own custom interactions.
      </>
    ),
  },
];

function FeatureLayout({title, description}) {
  return (
    <div className="col col--3 feature__container">
      <div className="text--center">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Feature() {
  return (
    <>
      {FeatureList.map((props, idx) => (
        <FeatureLayout key={idx} {...props} />
      ))}
    </>
  );
}
