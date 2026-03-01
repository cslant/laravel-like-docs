import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/feature/style.scss";

type FeatureItem = {
  title: string;
  emoji: string;
  description: React.ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    emoji: "✨",
    description: (
      <>
        You can easily integrate this package into your Laravel application. The
        package is designed to be user-friendly and requires minimal setup.
      </>
    ),
  },
  {
    title: "Advanced Customization",
    emoji: "⚙️",
    description: (
      <>
        Customize the package to suit your needs. You can configure the package
        to work with different types of interactions and events.
      </>
    ),
  },
  {
    title: "Multiple Interaction Types",
    emoji: "💖",
    description: (
      <>
        The package supports various interaction types, including likes,
        dislikes, and loves. Or you can create your own custom interactions.
      </>
    ),
  },
];

function FeatureLayout({
  title,
  emoji,
  description,
  index,
}: FeatureItem & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <div
      ref={ref}
      className="col col--3 feature__container"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`,
      }}
    >
      <div className="text--center">
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{emoji}</div>
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
        <FeatureLayout key={idx} index={idx} {...props} />
      ))}
    </>
  );
}
