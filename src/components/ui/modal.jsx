import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

export function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, onClose }) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h2 className="text-2xl font-semibold text-gray-900">{children}</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500 transition-colors"
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

export function ModalBody({ children }) {
  return <div className="p-6">{children}</div>
}

export function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
      {children}
    </div>
  )
}

