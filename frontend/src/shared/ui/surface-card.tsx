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
        'rounded-2xl border border-white/10 bg-slate-950/58 shadow-[0_20px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
