import { useState } from 'react';
import { 
  BarChart3, 
  Brain, 
  Database, 
  Settings, 
  TrendingUp, 
  Users,
  Zap,
  ChevronDown
} from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NavLink } from 'react-router-dom';

const analyticsItems = [
  { name: 'Overview', href: '/overview', current: false, icon: BarChart3 },
  { name: 'Real-time Analytics', href: '/analytics/realtime', current: false, icon: TrendingUp },
  { name: 'Custom Reports', href: '/analytics/reports', current: false, icon: BarChart3 },
];

const aiItems = [
  { name: 'AI Insights', href: '/ai/insights', current: false, icon: Brain },
  { name: 'ML Models', href: '/ai/models', current: false, icon: Zap },
  { name: 'Predictions', href: '/ai/predictions', current: false, icon: TrendingUp },
];

const dataItems = [
  { name: 'Data Sources', href: '/data/sources', current: false, icon: Database },
  { name: 'Users', href: '/data/users', current: false, icon: Users },
  { name: 'API Logs', href: '/data/logs', current: false, icon: Database },
];

const systemItems = [
  { name: 'Settings', href: '/settings', current: false, icon: Settings },
];

export const Sidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);
  const [dataOpen, setDataOpen] = useState(false);

  const renderMenuItems = (items: typeof analyticsItems) => (
    <SidebarMenu>
      {items.map((item) => {
        const IconComp = (item as any).icon ?? BarChart3;
        return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild className={cn("transition-all duration-200 group")}>
              <NavLink
                to={item.href}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg border border-primary/20"
                      : "hover:bg-muted hover:text-foreground text-muted-foreground"
                  )
                }
              >
                <IconComp className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

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
              <h1 className="text-lg font-semibold text-foreground truncate">AI Analytics</h1>
              <p className="text-xs text-muted-foreground truncate">Dashboard</p>
            </div>
          )}
        </div>
        {/* Mobile trigger */}
        <div className="md:hidden mt-2">
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Analytics Section */}
        <SidebarGroup>
          <Collapsible open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className={cn(
                "group/label cursor-pointer hover:bg-muted rounded-md p-2 transition-colors",
                collapsed && "justify-center"
              )}>
                <BarChart3 className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-2 flex-1 text-left">Analytics</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      analyticsOpen && "rotate-180"
                    )} />
                  </>
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                {renderMenuItems(analyticsItems)}
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* AI Section */}
        <SidebarGroup>
          <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className={cn(
                "group/label cursor-pointer hover:bg-muted rounded-md p-2 transition-colors",
                collapsed && "justify-center"
              )}>
                <Brain className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-2 flex-1 text-left">AI & ML</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      aiOpen && "rotate-180"
                    )} />
                  </>
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                {renderMenuItems(aiItems)}
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Data Section */}
        <SidebarGroup>
          <Collapsible open={dataOpen} onOpenChange={setDataOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className={cn(
                "group/label cursor-pointer hover:bg-muted rounded-md p-2 transition-colors",
                collapsed && "justify-center"
              )}>
                <Database className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-2 flex-1 text-left">Data</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      dataOpen && "rotate-180"
                    )} />
                  </>
                )}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                {renderMenuItems(dataItems)}
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* System Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            {renderMenuItems(systemItems)}
          </SidebarGroupContent>
        </SidebarGroup>
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