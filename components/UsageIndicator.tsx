'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface UsageIndicatorProps {
  remaining: number
  limit: number
  tier?: 'free' | 'premium'
}

export function UsageIndicator({
  remaining,
  limit,
  tier = 'free',
}: UsageIndicatorProps) {
  const used = limit - remaining
  const percentage = (used / limit) * 100

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1 min-w-[120px]">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${getStatusColor()}`}>
            {remaining}/{limit}
          </span>
          <Badge variant={tier === 'premium' ? 'default' : 'secondary'}>
            {tier === 'premium' ? 'Premium' : 'Free'}
          </Badge>
        </div>
        <Progress value={percentage} className="w-[120px] h-2" />
      </div>
    </div>
  )
}
