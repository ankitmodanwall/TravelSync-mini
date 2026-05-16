import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "border-input bg-background focus-visible:ring-ring",
        filled: "border-transparent bg-secondary/50 focus-visible:ring-ring focus-visible:bg-background",
        ghost: "border-transparent bg-transparent focus-visible:ring-ring hover:bg-accent/50",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-3 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
      error: {
        true: "border-destructive focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, startIcon, endIcon, type, ...props }, ref) => {
    if (startIcon || endIcon) {
      return (
        <div className="relative w-full flex items-center">
          {startIcon && (
            <div className="absolute left-3 flex items-center justify-center text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, size, error }),
              startIcon && "pl-10",
              endIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 flex items-center justify-center text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
              {endIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, error }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
