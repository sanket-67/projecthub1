export function Logo({ className = "", size = "md" }) {
    const sizes = {
      sm: "h-6",
      md: "h-8",
      lg: "h-10"
    }
  
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-lg opacity-50 animate-pulse" />
          <svg 
            className={`relative ${sizes[size]} aspect-square`}
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              className="fill-blue-600"
            />
            <path
              d="M2 17L12 22L22 17"
              className="stroke-indigo-600 stroke-2"
            />
            <path
              d="M2 12L12 17L22 12"
              className="stroke-blue-600 stroke-2"
            />
          </svg>
        </div>
        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ProjectHub
        </span>
      </div>
    )
  }
  