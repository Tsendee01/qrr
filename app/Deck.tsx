"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./deck.module.css";

export type Slide = {
  src: string;
  /** short name, used for the dots and for screen readers */
  label: string;
  alt: string;
};

/** how far either side of the viewport we keep animating a slide */
const CLAMP = 1.5;

export default function Deck({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const frameRef = useRef(0);
  const indexRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [moved, setMoved] = useState(false);

  /** writes each slide's distance from the viewport centre into CSS vars */
  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const width = track.clientWidth || 1;
    const left = track.scrollLeft;

    for (let i = 0; i < slideRefs.current.length; i++) {
      const el = slideRefs.current[i];
      if (!el) continue;
      const raw = (i * width - left) / width;
      const p = Math.max(-CLAMP, Math.min(CLAMP, raw));
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--a", Math.abs(p).toFixed(4));
    }

    const next = Math.max(0, Math.min(slides.length - 1, Math.round(left / width)));
    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
    }
    if (left > 4) setMoved(true);
  }, [slides.length]);

  const onScroll = useCallback(() => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      paint();
    });
  }, [paint]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: track.clientWidth * target, behavior: "smooth" });
      setMoved(true);
    },
    [slides.length],
  );

  useLayoutEffect(() => {
    paint();
  }, [paint]);

  // keep the current slide filling the screen when the phone is rotated
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onResize = () => {
      track.scrollTo({ left: track.clientWidth * indexRef.current });
      paint();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [paint]);

  // arrow keys for anyone on a laptop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goTo(indexRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(indexRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(slides.length - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, slides.length]);

  return (
    <main className={styles.stage}>
      <div
        ref={trackRef}
        className={styles.track}
        onScroll={onScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label="Olon Khond Tourist Camp brochure"
        tabIndex={0}
      >
        {slides.map((slide, i) => {
          const live = Math.abs(i - index) <= 1;
          return (
            <section
              key={slide.src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className={`${styles.slide}${live ? ` ${styles.live}` : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length} — ${slide.label}`}
            >
              <div className={styles.ambient} aria-hidden="true">
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  sizes="45vw"
                  quality={35}
                  priority={i === 0}
                  className={styles.ambientImg}
                />
              </div>

              <div className={styles.card}>
                <div className={styles.frame}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 56vh"
                    quality={88}
                    priority={i < 2}
                    className={styles.page}
                  />
                </div>
              </div>

              <div className={styles.shade} aria-hidden="true" />
            </section>
          );
        })}
      </div>

      <div
        className={styles.hint}
        data-show={!moved && index === 0 ? "" : undefined}
        aria-hidden="true"
      >
        <span>Swipe</span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <nav className={styles.dots} aria-label="Brochure pages">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={styles.dot}
            data-active={i === index ? "" : undefined}
            aria-current={i === index ? "true" : undefined}
            aria-label={`Page ${i + 1}: ${slide.label}`}
            onClick={() => goTo(i)}
          />
        ))}
      </nav>

      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        aria-label="Previous page"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => goTo(index + 1)}
        disabled={index === slides.length - 1}
        aria-label="Next page"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </main>
  );
}
