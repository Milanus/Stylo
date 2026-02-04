'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Megaphone, Loader2, Sparkles, Bug, Zap, Bell } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import type { NewsItem, NewsType, Locale } from '@/lib/news/types'

interface NewsDrawerProps {
  /** Optional callback when a news item is clicked */
  onNewsClick?: (item: NewsItem) => void
}

export default function NewsDrawer({ onNewsClick }: NewsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const locale = useLocale() as Locale
  const t = useTranslations('newsDrawer')

  useEffect(() => {
    if (isOpen) {
      fetchNews()
    }
  }, [isOpen, locale])

  const fetchNews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/news?locale=${locale}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load news')
        return
      }

      setNews(data.data || [])
    } catch (err) {
      setError('Failed to load news')
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = (item: NewsItem) => {
    onNewsClick?.(item)
    // If item has a link, open it in a new tab
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer')
    }
  }

  const getTypeIcon = (type: NewsType) => {
    switch (type) {
      case 'feature':
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
      case 'fix':
        return <Bug className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
      case 'improvement':
        return <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      case 'announcement':
        return <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
      default:
        return <Megaphone className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
    }
  }

  const getTypeBadgeStyles = (type: NewsType) => {
    switch (type) {
      case 'feature':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
      case 'fix':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
      case 'improvement':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      case 'announcement':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    }
  }

  const getTypeLabel = (type: NewsType) => {
    const labels: Record<NewsType, string> = {
      feature: 'Feature',
      fix: 'Fix',
      improvement: 'Improvement',
      announcement: 'Announcement'
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)

    // Use Intl.DateTimeFormat for proper internationalization
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).format(date)
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '…'
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          aria-label="View news and updates"
        >
          <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">News</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] sm:w-[420px] p-0 flex flex-col"
        aria-describedby="news-description"
      >
        <SheetHeader className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            News & Updates
          </SheetTitle>
          <SheetDescription id="news-description" className="text-sm text-slate-600 dark:text-slate-400">
            {news.length > 0 ? `${news.length} ${news.length === 1 ? 'update' : 'updates'}` : 'Latest features and improvements'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label="Loading news" />
            </div>
          ) : error ? (
            <div
              className="py-16 text-center px-4"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchNews}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : news.length === 0 ? (
            <div className="py-16 text-center px-4">
              <Megaphone className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" aria-hidden="true" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No news available</p>
            </div>
          ) : (
            <div className="py-2">
              {news.map((item, index) => (
                <article
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <button
                    onClick={() => handleItemClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleItemClick(item)
                      }
                    }}
                    className="w-full text-left px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-inset"
                    aria-label={`${getTypeLabel(item.type)}: ${item.title}`}
                  >
                    {/* Header with badge and date */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${getTypeBadgeStyles(item.type)}`}>
                        {getTypeIcon(item.type)}
                        {getTypeLabel(item.type)}
                      </span>
                      <time
                        dateTime={item.date}
                        className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0"
                      >
                        {formatDate(item.date)}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {truncateText(item.description, 140)}
                    </p>

                    {/* Version badge if present */}
                    {item.version && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                          v{item.version}
                        </span>
                      </div>
                    )}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer with view all link */}
        {news.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = `/${locale}/news`
              }}
              className="w-full"
            >
              View All Updates
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
