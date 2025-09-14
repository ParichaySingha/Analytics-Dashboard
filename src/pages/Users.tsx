import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { AddUserDialog } from '@/components/users/AddUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { Users, Search, Filter, UserPlus, Mail, Phone, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastSeen: string;
  avatar: string | null;
  joinDate: string;
  sessions: number;
  location: string;
}

const initialUsers: UserType[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Admin',
    status: 'active',
    lastSeen: '2 minutes ago',
    avatar: null,
    joinDate: '2023-01-15',
    sessions: 847,
    location: 'New York, US'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Analyst',
    status: 'active',
    lastSeen: '15 minutes ago',
    avatar: null,
    joinDate: '2023-03-22',
    sessions: 523,
    location: 'San Francisco, US'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastSeen: '2 days ago',
    avatar: null,
    joinDate: '2023-05-10',
    sessions: 234,
    location: 'London, UK'
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Analyst',
    status: 'active',
    lastSeen: '1 hour ago',
    avatar: null,
    joinDate: '2023-02-28',
    sessions: 692,
    location: 'Seoul, KR'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    role: 'Admin',
    status: 'active',
    lastSeen: '5 minutes ago',
    avatar: null,
    joinDate: '2023-01-08',
    sessions: 1156,
    location: 'Toronto, CA'
  },
  {
    id: 6,
    name: 'Alex Petrov',
    email: 'alex.petrov@example.com',
    role: 'Viewer',
    status: 'pending',
    lastSeen: 'Never',
    avatar: null,
    joinDate: '2024-01-12',
    sessions: 0,
    location: 'Berlin, DE'
  }
];

const UsersPage = () => {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const { toast } = useToast();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/20 text-success border-success/30';
      case 'inactive': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Analyst': return 'bg-primary/20 text-primary border-primary/30';
      case 'Viewer': return 'bg-secondary/20 text-secondary border-secondary/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddUser = (newUserData: { name: string; email: string; role: string; status: string; location: string }) => {
    const newUser: UserType = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUserData,
      avatar: null,
      joinDate: new Date().toISOString().split('T')[0],
      sessions: 0,
      lastSeen: 'Never'
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been successfully removed from the system",
    });
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUserUpdated = (updatedUser: UserType) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const analystCount = users.filter(u => u.role === 'Analyst').length;
  const viewerCount = users.filter(u => u.role === 'Viewer').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Users</h1>
              <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <AddUserDialog onUserAdded={handleAddUser} />
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full animate-pulse-glow"></div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingUsers}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="w-3 h-3 bg-warning rounded-full"></div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-muted/10 to-muted/5 border-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{inactiveUsers}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
              <div className="w-3 h-3 bg-muted rounded-full"></div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search users by name or email..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={roleFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setRoleFilter('all')}
              >
                All Roles
              </Button>
              <Button 
                variant={roleFilter === 'Admin' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setRoleFilter('Admin')}
              >
                Admin
              </Button>
              <Button 
                variant={roleFilter === 'Analyst' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setRoleFilter('Analyst')}
              >
                Analyst
              </Button>
              <Button 
                variant={roleFilter === 'Viewer' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setRoleFilter('Viewer')}
              >
                Viewer
              </Button>
            </div>
          </div>
        </Card>

        {/* Users List */}
        <Card className="p-6">
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No users found</p>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
              <Card 
                key={user.id} 
                className="p-4 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <Badge variant="outline" className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span>Last seen: {user.lastSeen}</span>
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user.sessions}</p>
                      <p className="text-xs text-muted-foreground">Sessions</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user.location}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{new Date(user.joinDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Joined</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
              ))
            )}
          </div>
        </Card>

        {/* Role Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Role Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="text-2xl font-bold text-destructive mb-1">{adminCount}</div>
              <p className="text-sm text-muted-foreground">Administrators</p>
            </div>
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">{analystCount}</div>
              <p className="text-sm text-muted-foreground">Analysts</p>
            </div>
            <div className="text-center p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
              <div className="text-2xl font-bold text-secondary mb-1">{viewerCount}</div>
              <p className="text-sm text-muted-foreground">Viewers</p>
            </div>
          </div>
        </Card>

        {/* Edit User Dialog */}
        <EditUserDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;