import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import DecorativeHeader from "@/components/ui/decorative-header";
import PosNavbar from '@/components/pos/pos-navbar';
import Footer from "@/components/shared/footer";

export interface TabItem {
  value: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
  onSelect?: () => void;
}

interface AppLayoutProps {
  children?: ReactNode;
  title: string;
  subtitle?: string;
  headerIcon?: ReactNode;
  headerActions?: ReactNode;
  headerStats?: any[];
  colorScheme?: "blue" | "orange" | "green" | "purple" | "red";
  breadcrumbItems: { title: string; href: string }[];
  tabs?: TabItem[];
  defaultTab?: string;
  onTabChange?: (value: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
  headerIcon,
  headerActions,
  headerStats,
  colorScheme = "blue",
  breadcrumbItems,
  tabs,
  defaultTab,
  onTabChange,
}) => {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
    
    // Find the tab and call its onSelect if it exists
    const selectedTab = tabs?.find(tab => tab.value === value);
    if (selectedTab?.onSelect) {
      selectedTab.onSelect();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* POS Navbar - now sticky */}
      <PosNavbar />
      
      {/* Main Content - add padding-top to account for sticky header */}
      <div className="flex-1 flex flex-col h-full pt-16 md:pt-20">
        {/* Page Content */}
        <div className="flex-1 overflow-auto px-4 py-6 bg-orange-50/30">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Decorative Header */}
          <DecorativeHeader
            title={title}
            subtitle={subtitle}
            icon={headerIcon}
            actions={headerActions}
            stats={headerStats}
            colorScheme={colorScheme}
          />
          
          {/* Content with Tabs if provided */}
          <div className="mt-6">
            {tabs ? (
              <Tabs defaultValue={defaultTab || tabs[0].value} onValueChange={handleTabChange}>
                <TabsList className="mb-6 bg-white p-1 rounded-lg shadow-sm">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                    >
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              children
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;
