'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Plus, X, Trash2, Loader2, FileText, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUserPrompts, UserPrompt } from '@/hooks/useUserPrompts'

interface CustomPromptsSheetProps {
  onSelectPrompt: (promptId: string | null) => void
  selectedPromptId: string | null
}

export default function CustomPromptsSheet({
  onSelectPrompt,
  selectedPromptId,
}: CustomPromptsSheetProps) {
  const t = useTranslations('customPrompts')
  const { prompts, isLoading, meta, createPrompt, deletePrompt } =
    useUserPrompts()

  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newName, setNewName] = useState('')
  const [newKeywords, setNewKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null)

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim()
    if (trimmed && !newKeywords.includes(trimmed) && newKeywords.length < 10) {
      setNewKeywords([...newKeywords, trimmed])
      setKeywordInput('')
    }
  }

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setNewKeywords(newKeywords.filter((k) => k !== keyword))
  }

  const resetForm = () => {
    setNewName('')
    setNewKeywords([])
    setKeywordInput('')
    setFormError(null)
    setIsCreating(false)
  }

  const handleCreate = async () => {
    setFormError(null)

    if (!newName.trim()) {
      setFormError(t('errors.nameRequired'))
      return
    }
    if (newKeywords.length < 3) {
      setFormError(t('errors.minKeywords'))
      return
    }

    setIsSubmitting(true)
    try {
      await createPrompt({
        name: newName.trim(),
        keywords: newKeywords,
      })
      resetForm()
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : t('errors.createFailed')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(t('confirmDelete'))) {
      try {
        await deletePrompt(id)
        if (selectedPromptId === id) {
          onSelectPrompt(null)
        }
      } catch (err) {
        console.error('Delete failed:', err)
      }
    }
  }

  const handleSelectPrompt = (prompt: UserPrompt) => {
    if (selectedPromptId === prompt.id) {
      onSelectPrompt(null)
    } else {
      onSelectPrompt(prompt.id)
    }
    setIsOpen(false)
  }

  const canCreate = meta.remaining === null || meta.remaining > 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
        >
          <Sparkles className="h-3 w-3 inline mr-1" />
          <span>{t('myPrompts')}</span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[85vw] sm:w-[420px] p-0">
        <SheetHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <SheetTitle className="text-base font-bold">{t('title')}</SheetTitle>
          <SheetDescription className="text-xs text-slate-500 dark:text-slate-400">
            {t('description')}
            {meta.limit && (
              <span className="block mt-1">
                {t('usage', { used: meta.count, limit: meta.limit })}
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="h-[calc(100vh-100px)] overflow-y-auto p-4">
          {/* Existing Prompts List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : prompts.length === 0 && !isCreating ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('noPrompts')}
              </p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSelectPrompt(prompt)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPromptId === prompt.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {selectedPromptId === prompt.id && (
                        <Check className="h-4 w-4 text-indigo-600" />
                      )}
                      <span className="font-medium text-sm text-slate-900 dark:text-white">
                        {prompt.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={(e) => handleDelete(prompt.id, e)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {prompt.keywords.slice(0, 5).map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="text-xs py-0"
                      >
                        {kw}
                      </Badge>
                    ))}
                    {prompt.keywords.length > 5 && (
                      <Badge variant="outline" className="text-xs py-0">
                        +{prompt.keywords.length - 5}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Create New Form */}
          {isCreating ? (
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
              <div>
                <Label htmlFor="prompt-name" className="text-sm">
                  {t('form.name')}
                </Label>
                <Input
                  id="prompt-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('form.namePlaceholder')}
                  maxLength={50}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">
                  {t('form.keywords')} ({newKeywords.length}/10)
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={handleKeywordKeyPress}
                    placeholder={t('form.keywordPlaceholder')}
                    maxLength={30}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddKeyword}
                    disabled={newKeywords.length >= 10 || !keywordInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2 min-h-[28px]">
                  {newKeywords.map((kw) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="gap-1 pr-1 text-xs"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {t('form.keywordsHint', { min: 3, max: 10 })}
                </p>
              </div>

              {formError && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded">
                  {formError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {t('form.cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('form.create')
                  )}
                </Button>
              </div>
            </div>
          ) : canCreate ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('createNew')}
            </Button>
          ) : (
            <div className="text-center py-4 text-slate-500 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
              {t('limitReached')}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
