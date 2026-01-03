'use client'

import { Textarea } from '@/components/ui/textarea'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  maxLength?: number
}

export function TextEditor({
  value,
  onChange,
  placeholder = 'Enter text...',
  readOnly = false,
  maxLength = 10000,
}: TextEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      maxLength={maxLength}
      className="min-h-[300px] resize-none font-mono text-sm"
    />
  )
}
