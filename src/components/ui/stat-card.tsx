import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"

const statCardVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        gradient: "bg-gradient-to-br from-primary to-[#6c63ff] text-white border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface StatCardProps extends VariantProps<typeof statCardVariants> {
  className?: string
  label: string
  value: string | number
  subtext?: string
  icon?: React.ElementType
  trend?: "up" | "down" | "neutral"
}

export function StatCard({
  className,
  variant,
  label,
  value,
  subtext,
  icon: Icon,
  trend,
}: StatCardProps) {
  const isGradient = variant === "gradient"
  
  return (
    <Card className={cn(statCardVariants({ variant }), className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className={cn("text-sm font-medium", isGradient ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {label}
          </p>
          {Icon && (
            <Icon className={cn("h-4 w-4", isGradient ? "text-primary-foreground" : "text-muted-foreground")} />
          )}
        </div>
        <div className="flex items-baseline space-x-2">
          <h2 className="text-2xl font-bold">{value}</h2>
          {trend && trend !== "neutral" && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                isGradient
                  ? "text-primary-foreground"
                  : trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              <span className="sr-only">
                {trend === "up" ? "Increased" : "Decreased"}
              </span>
            </span>
          )}
        </div>
        {subtext && (
          <p className={cn("mt-1 text-xs", isGradient ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
