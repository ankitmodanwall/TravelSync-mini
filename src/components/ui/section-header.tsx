import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionHeaderVariants = cva("flex flex-col gap-1 md:flex-row md:items-center md:justify-between", {
  variants: {
    size: {
      sm: "mb-4",
      default: "mb-6",
      lg: "mb-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const titleVariants = cva("font-bold tracking-tight text-foreground", {
  variants: {
    size: {
      sm: "text-lg md:text-xl",
      default: "text-2xl md:text-3xl",
      lg: "text-3xl md:text-4xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface SectionHeaderProps extends VariantProps<typeof sectionHeaderVariants> {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  action,
  size,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(sectionHeaderVariants({ size }), className)}>
      <div className="space-y-1">
        <h2 className={cn(titleVariants({ size }))}>{title}</h2>
        {subtitle && (
          <p className={cn(
            "text-muted-foreground",
            size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"
          )}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="mt-4 flex shrink-0 items-center gap-2 md:mt-0">
          {action}
        </div>
      )}
    </div>
  )
}
