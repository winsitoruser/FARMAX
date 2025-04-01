import { ChevronRight } from 'lucide-react';
import useSidebar from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface SidebarToggleProps {
  className?: string;
}

const SidebarToggle = ({ className }: SidebarToggleProps) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <Button
      onClick={() => toggle()}
      className={cn("duration-500", isOpen && "rotate-180", className)}
      size="sm"
      variant="ghost"
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
};

export default SidebarToggle;