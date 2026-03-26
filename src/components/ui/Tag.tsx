import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { FC, MouseEventHandler, ReactNode } from 'react';

const tagVariants = cva(
  "font-medium px-2 py-1 rounded-full w-fit h-fit text-sm border",
  {
    variants: {
      color: {
        primary: "bg-primary/5 text-primary border-primary",
        success: "bg-emerald-500/5 text-emerald-500 border-emerald-500",
        disabled: "bg-slate-100 text-slate-500 border-slate-500",
        warning: "bg-rose-500/5 text-rose-500 border-rose-500",
        alert: "bg-amber-500/5 text-amber-500 border-amber-500",
        pending: "bg-amber-500/5 text-amber-500 border-amber-500",
        sended: "bg-sky-500/5 text-sky-500 border-sky-500",
        accepted: "bg-emerald-500/5 text-emerald-500 border-emerald-500",
        validation: "bg-amber-500/5 text-amber-500 border-amber-500",
        aborted: "bg-red-500/5 text-red-500 border-red-500",
        expired: "bg-red-500/5 text-red-500 border-red-500"
      }
    },
    defaultVariants: {
      color: 'primary',
    }
  }
)


const Tag: FC<{ className?: string, children: ReactNode, onClick?: MouseEventHandler<HTMLDivElement> } & VariantProps<typeof tagVariants>> = ({ className, children, color, onClick }) => {

  return (
    <div className={cn(tagVariants({ color, className }))} onClick={onClick}>
      {children}
    </div>
  )
}

export default Tag