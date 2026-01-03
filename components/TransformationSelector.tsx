'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  FileText,
  Briefcase,
  MessageCircle,
  Scale,
  Minimize2,
  Maximize2,
} from 'lucide-react'

interface TransformationType {
  id: string
  label: string
  description: string
}

interface TransformationSelectorProps {
  selected: string
  onSelect: (id: string) => void
}

const transformationIcons: Record<string, any> = {
  grammar: CheckCircle2,
  formal: Briefcase,
  informal: MessageCircle,
  legal: Scale,
  summary: Minimize2,
  expand: Maximize2,
}

export function TransformationSelector({
  selected,
  onSelect,
}: TransformationSelectorProps) {
  const [transformationTypes, setTransformationTypes] = useState<TransformationType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch transformation types from API
    fetch('/api/transform')
      .then((res) => res.json())
      .then((data) => {
        setTransformationTypes(data.transformationTypes)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch transformation types:', err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {transformationTypes.map((type) => {
        const Icon = transformationIcons[type.id] || FileText
        const isSelected = selected === type.id

        return (
          <Button
            key={type.id}
            variant={isSelected ? 'default' : 'outline'}
            className={`h-auto flex-col items-start p-4 ${
              isSelected
                ? 'border-2 border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelect(type.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5" />
              <span className="font-semibold">{type.label}</span>
            </div>
            <span className="text-xs text-left opacity-80 font-normal">
              {type.description}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
