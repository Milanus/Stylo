'use client';

import { NewsGroup } from '@/lib/news/types';
import { NewsItem } from './NewsItem';
import { useEffect, useState, useRef } from 'react';

interface Props {
  groups: NewsGroup[];
  locale: string;
}

export function NewsTimeline({ groups, locale }: Props) {
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track which month is currently in view
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveMonth(entry.target.getAttribute('data-month'));
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px' }
    );

    const sections = document.querySelectorAll('[data-month]');
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, [groups]);

  // Early return for empty state (Vercel Best Practice 7.8)
  if (groups.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="inline-flex flex-col items-center gap-4">
          {/* Empty state illustration */}
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <span className="text-3xl" aria-hidden="true">📰</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No updates yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {groups.map((group, groupIndex) => (
        <section
          key={group.month}
          data-month={group.month}
          aria-labelledby={`month-${groupIndex}`}
        >
          {/* Month header with active indicator */}
          <div className="sticky top-20 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm py-3 mb-6 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              {/* Active indicator dot */}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeMonth === group.month
                    ? 'bg-indigo-500 dark:bg-indigo-400 scale-100'
                    : 'bg-slate-300 dark:bg-slate-700 scale-75'
                }`}
                style={{ transitionProperty: 'background-color, transform' }}
                aria-hidden="true"
              />
              <h2
                id={`month-${groupIndex}`}
                className={`text-lg font-semibold transition-colors duration-300 ${
                  activeMonth === group.month
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-900 dark:text-white'
                }`}
                style={{
                  textWrap: 'balance',
                  transitionProperty: 'color'
                } as React.CSSProperties}
              >
                {group.month}
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {group.items.length} {group.items.length === 1 ? 'update' : 'updates'}
              </span>
            </div>
          </div>

          {/* News items with animated timeline */}
          <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800">
            {/* Gradient fade at top */}
            <div className="absolute top-0 left-0 w-0.5 h-8 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent -ml-[2px]" aria-hidden="true" />

            <div className="space-y-4">
              {group.items.map((item) => (
                <NewsItem key={item.id} item={item} locale={locale} />
              ))}
            </div>

            {/* Gradient fade at bottom if not last group */}
            {groupIndex < groups.length - 1 ? (
              <div className="absolute bottom-0 left-0 w-0.5 h-8 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent -ml-[2px]" aria-hidden="true" />
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
