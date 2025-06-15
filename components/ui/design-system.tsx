import * as React from "react"
import { cn } from "../../lib/utils"
import { VariantProps, cva } from "class-variance-authority"

// ==========================================
// CARD SYSTEM
// ==========================================

const cardVariants = cva(
  "card-base",
  {
    variants: {
      variant: {
        primary: "card-primary",
        compact: "card-compact", 
        dense: "card-dense",
        glass: "card-glass",
        elevated: "card-elevated"
      },
      interactive: {
        true: "interactive-hover cursor-pointer",
        false: ""
      }
    },
    defaultVariants: {
      variant: "primary",
      interactive: false
    }
  }
)

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

// ==========================================
// BUTTON SYSTEM
// ==========================================

const buttonVariants = cva(
  "btn-base focus-ring interactive-press",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        sm: "btn-sm",
        md: "btn-md", 
        lg: "btn-lg"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"

// ==========================================
// TYPOGRAPHY SYSTEM
// ==========================================

const headingVariants = cva(
  "",
  {
    variants: {
      level: {
        1: "heading-1",
        2: "heading-2", 
        3: "heading-3",
        4: "heading-4",
        5: "heading-5",
        6: "heading-6"
      },
      gradient: {
        true: "gradient-text",
        false: ""
      }
    },
    defaultVariants: {
      level: 3,
      gradient: false
    }
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, gradient, as, ...props }, ref) => {
    const Component = (as || `h${level}`) as React.ElementType
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ level, gradient }), className)}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

const textVariants = cva(
  "",
  {
    variants: {
      variant: {
        large: "body-large",
        base: "body-base",
        small: "body-small",
        caption: "caption"
      },
      muted: {
        true: "text-muted-foreground",
        false: ""
      }
    },
    defaultVariants: {
      variant: "base",
      muted: false
    }
  }
)

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div'
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, muted, as = 'p', ...props }, ref) => {
    const Component = as
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, muted }), className)}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

// ==========================================
// LAYOUT SYSTEM
// ==========================================

const containerVariants = cva(
  "",
  {
    variants: {
      variant: {
        content: "container-content",
        narrow: "container-narrow",
        wide: "container-wide"
      }
    },
    defaultVariants: {
      variant: "content"
    }
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ variant }), className)}
      {...props}
    />
  )
)
Container.displayName = "Container"

const gridVariants = cva(
  "",
  {
    variants: {
      variant: {
        "responsive-2": "grid-responsive-2",
        "responsive-3": "grid-responsive-3",
        "responsive-4": "grid-responsive-4",
        "auto-fit": "grid-auto-fit",
        "auto-fill": "grid-auto-fill"
      }
    },
    defaultVariants: {
      variant: "responsive-3"
    }
  }
)

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridVariants({ variant }), className)}
      {...props}
    />
  )
)
Grid.displayName = "Grid"

// ==========================================
// STATUS SYSTEM - Purple accent for active states
// ==========================================

const statusVariants = cva(
  "status-badge",
  {
    variants: {
      variant: {
        active: "status-active",
        inactive: "status-inactive", 
        pending: "status-pending"
      }
    },
    defaultVariants: {
      variant: "active"
    }
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(statusVariants({ variant }), className)}
      {...props}
    />
  )
)
StatusBadge.displayName = "StatusBadge"

// ==========================================
// INPUT SYSTEM
// ==========================================

const inputVariants = cva(
  "input-base input-focus",
  {
    variants: {
      error: {
        true: "input-error",
        false: ""
      }
    },
    defaultVariants: {
      error: false
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(inputVariants({ error }), className)}
      {...props}
    />
  )
)
Input.displayName = "Input"

// ==========================================
// UTILITY COMPONENTS
// ==========================================

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'section' | 'component' | 'element' | 'tight'
}

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size = 'component', ...props }, ref) => {
    const sizeClasses = {
      section: 'space-section',
      component: 'space-component',
      element: 'space-element',
      tight: 'space-tight'
    }
    
    return (
      <div
        ref={ref}
        className={cn(sizeClasses[size], className)}
        {...props}
      />
    )
  }
)
Spacer.displayName = "Spacer"

// ==========================================
// SPECIALIZED COMPONENTS
// ==========================================

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  subtitle?: string
  loading?: boolean
}

export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, subtitle, loading, ...props }, ref) => (
    <Card
      ref={ref}
      variant="compact"
      className={cn("text-center", className)}
      {...props}
    >
      <Heading level={6} className="text-muted-foreground mb-2">
        {title}
      </Heading>
      {loading ? (
        <div className="h-8 bg-muted/20 animate-pulse rounded mb-1" />
      ) : (
        <Heading level={2} className="text-accent mb-1">
          {value}
        </Heading>
      )}
      {subtitle && (
        <Text variant="small" muted>
          {subtitle}
        </Text>
      )}
    </Card>
  )
)
StatsCard.displayName = "StatsCard"

export interface DeploymentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  deploymentId: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  interactive?: boolean
  onDelete?: () => void
}

export const DeploymentCard = React.forwardRef<HTMLDivElement, DeploymentCardProps>(
  ({ className, deploymentId, status, createdAt, interactive, onDelete, ...props }, ref) => (
    <Card
      ref={ref}
      variant="compact"
      interactive={interactive}
      className={cn("relative", className)}
      {...props}
    >
      <div className="flex justify-between items-start mb-3">
        <Heading level={5} className="text-foreground/95">
          {deploymentId}
        </Heading>
        <StatusBadge variant={status}>
          {status}
        </StatusBadge>
      </div>
      <Text variant="small" muted>
        Created {createdAt}
      </Text>
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors duration-300"
        >
          ×
        </button>
      )}
    </Card>
  )
)
DeploymentCard.displayName = "DeploymentCard" 