import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl font-headline",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-headline",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight font-headline",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight font-headline",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "ul" | "code" | "span" | "div"

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement
}

export function Typography({
  className,
  variant,
  as,
  ...props
}: TypographyProps) {
  const variantToTag: Record<string, TypographyElement> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p: "p",
    blockquote: "blockquote",
    ul: "ul",
    inlineCode: "code",
    lead: "p",
    large: "div",
    small: "span",
    muted: "p",
  }

  const Component = as || (variant ? variantToTag[variant as string] : "p") || "p"

  return (
    <Component
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}
