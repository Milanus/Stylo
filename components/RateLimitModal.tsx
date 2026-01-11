'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Clock, Zap, UserPlus } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface RateLimitModalProps {
  isOpen: boolean
  onClose: () => void
  resetTime: number | null
  isAnonymous: boolean
  currentLimit: number
}

export default function RateLimitModal({
  isOpen,
  onClose,
  resetTime,
  isAnonymous,
  currentLimit,
}: RateLimitModalProps) {
  const router = useRouter()
  const t = useTranslations('rateLimitModal')
  const tCommon = useTranslations('common')
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!resetTime) return

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000)
      const diff = resetTime - now

      if (diff <= 0) {
        setTimeRemaining('now')
        return
      }

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else {
        setTimeRemaining(`${minutes}m`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 30000) // Update every 30s

    return () => clearInterval(interval)
  }, [resetTime])

  const handleSignUp = () => {
    router.push('/signup')
    onClose()
  }

  const handleLogin = () => {
    router.push('/login')
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[425px] mx-4 overflow-hidden">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <AlertDialogTitle className="text-xl">
              {isAnonymous ? t('guestTitle') : t('registeredTitle')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm space-y-3 pt-2">
            {isAnonymous ? (
              <>
                <p className="text-slate-700 dark:text-slate-300">
                  {t('guestUsedAll', { limit: currentLimit })}
                </p>
                <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                    {t('signUpBenefits')}
                  </p>
                  <ul className="space-y-1.5 text-indigo-800 dark:text-indigo-200">
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                      <strong>{t('moreTransformations')}</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                      {t('transformationHistory')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                      {t('multiLanguageOutput')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                      {t('saveYourWork')}
                    </li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {t('orWait', { time: timeRemaining })}
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-700 dark:text-slate-300">
                  {t('registeredUsedAll', { limit: currentLimit })}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <Clock className="h-5 w-5" />
                  <span>
                    {t('resetIn', { time: timeRemaining })}
                  </span>
                </div>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          {isAnonymous ? (
            <>
              <AlertDialogCancel onClick={onClose}>{tCommon('wait')}</AlertDialogCancel>
              <Button
                variant="outline"
                onClick={handleLogin}
                className="w-full sm:w-auto"
              >
                {tCommon('login')}
              </Button>
              <Button
                onClick={handleSignUp}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t('signUpFree')}
              </Button>
            </>
          ) : (
            <AlertDialogAction onClick={onClose}>{tCommon('ok')}</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
