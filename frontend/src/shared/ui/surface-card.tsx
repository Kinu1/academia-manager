import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '../utils/cn'

type SurfaceCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'article' | 'section' | 'div'
}

export function SurfaceCard({ as: Component = 'section', className, children, ...props }: SurfaceCardProps) {
  return (
    <Component
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
