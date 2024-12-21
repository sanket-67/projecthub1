"use client"

import { useState, KeyboardEvent } from "react"
import { X } from 'lucide-react'

interface TagInputProps {
  label?: string
  value: string[]
  onChange: (tags: string[]) => void
  error?: string
}

export function TagInput({ label, value, onChange, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      <div className={`
        flex min-h-10 flex-wrap gap-2 rounded-md border bg-background p-2
        ${error ? "border-red-500" : "border-input"}
      `}>
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-blue-200"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder="Type and press Enter"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

