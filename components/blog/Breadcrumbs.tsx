'use client'

import { Link } from '@/i18n/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Build JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: typeof window !== 'undefined' ? `${window.location.origin}` : '',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item:
          typeof window !== 'undefined'
            ? `${window.location.origin}${item.href}`
            : '',
      })),
    ],
  }

  return (
    <>
      {/* JSON-LD for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visual breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {/* Breadcrumb items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={item.href} className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                {isLast ? (
                  <span
                    className="font-medium text-slate-900 dark:text-white"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
