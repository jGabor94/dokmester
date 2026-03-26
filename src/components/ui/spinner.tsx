import { cn } from '@/lib/utils';
import { LoaderCircle, LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

const Spinner = forwardRef<SVGSVGElement, LucideProps>(({ className, color, ...props }, ref) => (
  <LoaderCircle
    ref={ref}
    className={cn("animate-spin", className)}
    size={50}
    color={color || '#13a4ec'}
    {...props}
  />
));

Spinner.displayName = "Spinner";

export default Spinner;