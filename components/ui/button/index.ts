import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium font-onest ring-offset-background transition-colors focus-visible:outline-none border-2 border-solid border-transparent group-focus-visible:border-blue-400 focus-visible:border-blue-400 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        success: 'bg-green-400/25 text-green-400 hover:bg-green-400/15 hover:text-green-400/50',
        warning: 'bg-yellow-400/25 text-yellow-400 hover:bg-yellow-400/15 hover:text-yellow-400/50',
        info: 'bg-blue-400/25 text-blue-400 hover:bg-blue-400/15 hover:text-blue-400/50',
        error: 'bg-red-400/25 text-red-400 hover:bg-red-400/15 hover:text-red-400/50',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded px-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
