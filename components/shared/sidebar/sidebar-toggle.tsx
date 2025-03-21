import { ChevronRight } from 'lucide-react';
import useSidebar from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';


const SidebarToggle = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <Button
      onClick={() => toggle()}
      className={cn("duration-500", isOpen && "rotate-180")}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
};

export default SidebarToggle;