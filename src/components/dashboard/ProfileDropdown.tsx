import React from 'react';
import { User, Settings, LogOut, Mail, Calendar, Shield, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown: React.FC = () => {
  const { profile, clearProfile } = useProfile();
  const navigate = useNavigate();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'analyst':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    clearProfile();
    // In a real app, you would also clear authentication tokens
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/settings?tab=profile');
  };

  if (!profile) {
    return (
      <Button variant="ghost" size="icon">
        <User className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
              {getInitials(profile.firstName, profile.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {getInitials(profile.firstName, profile.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {profile.firstName} {profile.lastName}
                </h3>
                <Badge variant="outline" className={`text-xs ${getRoleColor(profile.role)}`}>
                  {profile.role}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{profile.email}</span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Profile Info Section */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Member since {formatDate(profile.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Last login: {formatDate(profile.lastLogin)}</span>
          </div>
          {profile.bio && (
            <div className="text-sm text-muted-foreground mt-2">
              <p className="line-clamp-2">{profile.bio}</p>
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Action Items */}
        <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
