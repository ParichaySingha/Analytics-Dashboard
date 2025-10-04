import { 
  BarChart3, 
  Brain, 
  Database, 
  Settings, 
  TrendingUp, 
  Users,
  Zap
} from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const navigationSections = [
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { name: 'Overview', href: '/overview', icon: BarChart3 },
      { name: 'Real-time Analytics', href: '/analytics/realtime', icon: TrendingUp },
      { name: 'Custom Reports', href: '/analytics/reports', icon: BarChart3 },
    ]
  },
  {
    id: 'ai',
    label: 'AI & ML',
    items: [
      { name: 'AI Insights', href: '/ai/insights', icon: Brain },
      { name: 'ML Models', href: '/ai/models', icon: Zap },
      { name: 'Predictions', href: '/ai/predictions', icon: TrendingUp },
    ]
  },
  {
    id: 'data',
    label: 'Data',
    items: [
      { name: 'Data Sources', href: '/data/sources', icon: Database },
      { name: 'Users', href: '/data/users', icon: Users },
      { name: 'API Logs', href: '/data/logs', icon: Database },
    ]
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export const Sidebar = () => {
  const { state } = useSidebar();
  const { preferences } = usePreferences();
  const location = useLocation();
  const collapsed = state === 'collapsed';
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Determine which section is currently active based on the current route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find which section contains the current route
    const activeSectionId = navigationSections.find(section => 
      section.items.some(item => currentPath === item.href || currentPath.startsWith(item.href + '/'))
    )?.id;

    setActiveSection(activeSectionId || null);
  }, [location.pathname]);

  const renderMenuItems = (items: typeof navigationSections[0]['items']) => (
    <SidebarMenu>
      {items.map((item) => {
        const IconComp = (item as any).icon ?? BarChart3;
        return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild className={cn("transition-all duration-200 group w-full")}>
              <NavLink
                to={item.href}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary/10 text-foreground shadow-sm border border-primary/30 font-medium"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <IconComp className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-200",
                  location.pathname === item.href 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-foreground"
                )} />
                {!collapsed && (
                  <span className={cn(
                    "truncate transition-colors duration-200",
                    location.pathname === item.href 
                      ? "text-foreground font-medium" 
                      : "text-foreground"
                  )}>
                    {item.name}
                  </span>
                )}
                {location.pathname === item.href && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  const renderSection = (section: typeof navigationSections[0]) => {
    const isActive = activeSection === section.id;
    const hasActiveItem = section.items.some(item => location.pathname === item.href);

    return (
      <SidebarGroup key={section.id} className={cn(
        "transition-all duration-200",
        isActive && "bg-primary/5 border border-primary/20 rounded-lg"
      )}>
        <SidebarGroupLabel className={cn(
          "px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200",
          isActive 
            ? "text-foreground font-bold bg-primary/10 px-2 py-1 rounded-md" 
            : hasActiveItem 
              ? "text-foreground" 
              : "text-muted-foreground"
        )}>
          {section.label}
          {isActive && (
            <div className="inline-block w-2 h-2 bg-primary rounded-full ml-2 animate-pulse" />
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent className={cn(
          "transition-all duration-200",
          isActive && "bg-primary/5 rounded-md p-1"
        )}>
          {renderMenuItems(section.items)}
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <ShadcnSidebar className="border-r border-border bg-card">
      {/* Header */}
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-foreground truncate">{preferences.dashboardName}</h1>
              <p className="text-xs text-muted-foreground truncate">Dashboard</p>
            </div>
          )}
        </div>
        {/* Mobile trigger */}
        <div className="md:hidden mt-2">
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-1">
        {navigationSections.map(renderSection)}
      </SidebarContent>

      {/* Footer with collapse trigger */}
      <SidebarFooter className="border-t border-border p-2">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="text-xs text-muted-foreground px-2">
              v2.1.0
            </div>
          )}
          <div className="hidden md:block">
            <SidebarTrigger className="h-8 w-8" />
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};