'use client';

import { NewsItem as NewsItemType } from '@/lib/news/types';
import { getNewsTypeIcon, getNewsTypeColor, formatNewsDate } from '@/lib/news/utils';
import { useEffect, useRef, useState } from 'react';

interface Props {
  item: NewsItemType;
  locale: string;
}

// Enhanced component with animations and visual improvements
export function NewsItem({ item, locale }: Props) {
  // Cache property access for better performance (Vercel Best Practice 7.3)
  const icon = getNewsTypeIcon(item.type);
  const colorClass = getNewsTypeColor(item.type);
  const formattedDate = formatNewsDate(item.date, locale);

  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative pl-6 pb-6 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      {/* Timeline dot with pulse animation */}
      <div
        className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-500 dark:border-indigo-400 transition-all duration-300 ${
          isVisible ? 'scale-100' : 'scale-0'
        }`}
        style={{ transitionProperty: 'transform' }}
      >
        {/* Pulse ring effect for new items */}
        <span className="absolute inset-0 rounded-full bg-indigo-500/20 dark:bg-indigo-400/20 animate-ping"
              style={{ animationDuration: '2s' }}
              aria-hidden="true" />
      </div>

      {/* Content with hover effect */}
      <div
        className="group bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
        style={{ transitionProperty: 'box-shadow, border-color' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} transition-transform duration-200 group-hover:scale-105`}
            style={{ transitionProperty: 'transform' }}
            aria-label={`${item.type} update`}
          >
            <span aria-hidden="true">{icon}</span>
            <span className="capitalize">{item.type}</span>
          </span>
          <time
            className="text-sm text-slate-500 dark:text-slate-400"
            dateTime={item.date}
          >
            {formattedDate}
          </time>
          {item.version ? (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              v{item.version}
            </span>
          ) : null}
        </div>

        {/* Title with text-wrap balance for better typography */}
        <h3
          className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200"
          style={{ textWrap: 'balance', transitionProperty: 'color' } as React.CSSProperties}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {item.description}
        </p>

        {/* Optional link with proper focus styles */}
        {item.link ? (
          <a
            href={item.link}
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm outline-none transition-colors duration-200"
            style={{ transitionProperty: 'color' }}
            aria-label={`Learn more about ${item.title}`}
          >
            Learn More
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" style={{ transitionProperty: 'transform' }}>→</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
