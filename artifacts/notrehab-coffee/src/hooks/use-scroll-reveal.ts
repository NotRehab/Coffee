import { useEffect } from 'react';

/**
 * Scroll-triggered reveal.
 *
 * Observes every element carrying a `data-reveal` attribute and adds the
 * `is-in-view` class once it enters the viewport. The actual motion lives in
 * CSS (see index.css `.reveal`), so the brand design is untouched — this only
 * decides *when* an element starts moving.
 *
 * Respects `prefers-reduced-motion`: when reduced motion is requested we mark
 * everything in-view immediately so nothing is hidden or animated.
 */
export function useScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );

    if (reduce) {
      targets.forEach((el) => el.classList.add('is-in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-in-view');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
