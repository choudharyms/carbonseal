import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-105 active:scale-100 before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-blue-600 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        destructive:
          "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl shadow-red-500/50 hover:shadow-2xl hover:shadow-red-500/70 hover:scale-105",
        outline:
          "border-2 border-blue-400 bg-white/80 backdrop-blur-sm text-blue-700 font-bold hover:bg-blue-50 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/30",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300 shadow-lg",
        ghost:
          "hover:bg-blue-100/80 hover:text-blue-700 backdrop-blur-sm",
        link:
          "text-blue-600 underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-lg px-5 text-xs",
        lg: "h-14 rounded-xl px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
