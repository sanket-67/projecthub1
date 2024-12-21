export function LoadingDots() {
    return (
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-current rounded-full animate-[bounce_0.7s_infinite] [animation-delay:-0.3s]" />
        <div className="h-2 w-2 bg-current rounded-full animate-[bounce_0.7s_infinite] [animation-delay:-0.15s]" />
        <div className="h-2 w-2 bg-current rounded-full animate-[bounce_0.7s_infinite]" />
      </div>
    )
  }
  
  