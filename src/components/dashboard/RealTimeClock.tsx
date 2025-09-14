import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';

export const RealTimeClock = () => {
  const { preferences } = usePreferences();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        timeZone: preferences.timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      // Fallback to local time if timezone is invalid
      return date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  };

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString('en-US', {
        timeZone: preferences.timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      // Fallback to local time if timezone is invalid
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full shadow-sm">
        <Clock className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <div className="text-lg font-mono font-semibold text-foreground tracking-wide">
          {formatTime(time)}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          {formatDate(time)}
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 rounded-full">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-sm"></div>
        <span className="text-xs text-success font-medium">Live</span>
      </div>
    </div>
  );
};
