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
import { History, FileText, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransformationTypes } from '@/hooks/useTransformationTypes'

interface HistoryItem {
  id: string
  originalText: string
  transformedText: string | null
  transformationType: string
  createdAt: string
}

interface HistoryDrawerProps {
  onLoadTransformation: (inputText: string, outputText: string, type: string) => void
}

export default function HistoryDrawer({ onLoadTransformation }: HistoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('historyDrawer')
  const tTransformations = useTranslations('transformations')
  const { types: transformationTypes } = useTransformationTypes()

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen])

  const fetchHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/history', {
        headers: { 'X-API-Key': process.env.NEXT_PUBLIC_STYLO_API_KEY || '' }
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t('failedToLoad'))
        return
      }

      setHistory(data.data)
    } catch (err) {
      setError(t('failedToLoad'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = (item: HistoryItem) => {
    onLoadTransformation(
      item.originalText,
      item.transformedText || '',
      item.transformationType
    )
    setIsOpen(false)
  }

  const getTransformationLabel = (type: string) => {
    const transformation = transformationTypes.find(t => t.slug === type)
    if (transformation) {
      return `${transformation.icon} ${tTransformations(`${type}.label`)}`
    }
    return type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('timeAgo.justNow')
    if (diffMins < 60) return t('timeAgo.minutes', { count: diffMins })
    if (diffHours < 24) return t('timeAgo.hours', { count: diffHours })
    if (diffDays < 7) return t('timeAgo.days', { count: diffDays })

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs"
        >
          <History className="h-3 w-3" />
          <span className="hidden sm:inline">{t('title')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0">
        <SheetHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <SheetTitle className="text-base font-bold">{t('title')}</SheetTitle>
          <SheetDescription className="text-xs text-slate-500 dark:text-slate-400">
            {t('transformationsCount', { count: history.length })}
          </SheetDescription>
        </SheetHeader>

        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <div className="py-12 text-center px-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center px-4">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('noTransformations')}</p>
            </div>
          ) : (
            <div className="py-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors active:bg-slate-200 dark:active:bg-slate-800"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {getTransformationLabel(item.transformationType)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Text Preview */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {truncateText(item.originalText, 120)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
