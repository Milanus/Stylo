'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Cpu, UserPlus } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface ModelLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModelLoginModal({ isOpen, onClose }: ModelLoginModalProps) {
  const router = useRouter()
  const t = useTranslations('modelLoginModal')
  const tCommon = useTranslations('common')

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
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <Cpu className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <AlertDialogTitle className="text-xl">
              {t('title')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm space-y-3 pt-2">
            <p className="text-slate-700 dark:text-slate-300">
              {t('description')}
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <ul className="space-y-1.5 text-indigo-800 dark:text-indigo-200">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  {t('benefit1')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  {t('benefit2')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  {t('benefit3')}
                </li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose}>{tCommon('cancel')}</AlertDialogCancel>
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
