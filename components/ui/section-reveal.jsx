"use client";

import { useEffect, useRef, useState } from "react";

export function SectionReveal({ as: Tag = "div", className = "", type = "up", children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-animate={type} className={`${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
