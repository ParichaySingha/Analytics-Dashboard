import { Bell, Search, User, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const TopBar = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile sidebar trigger */}
          <div className="md:hidden">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          
          <div className="flex items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Dashboard Overview</h2>
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Last updated:</span>
              <span className="text-foreground font-medium">2 minutes ago</span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search analytics..." 
              className="pl-10 w-60 md:w-80 bg-background/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="Toggle theme">
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('auto')}>
                <Monitor className="mr-2 h-4 w-4" />
                Auto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};