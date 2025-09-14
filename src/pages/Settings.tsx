import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings, User, Shield, Bell, Database, Palette, Save, Download, Trash2, Sun, Moon, Monitor } from 'lucide-react';
import { RealTimeClock } from '@/components/dashboard/RealTimeClock';

const SettingsPage = () => {
  const { toast } = useToast();
  const { theme, setTheme, actualTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    dashboardName: 'AI Analytics Dashboard',
    timezone: 'utc',
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    autoRefresh: true,
    soundAlerts: false,
    twoFactor: false,
    sessionTimeout: true,
    emailAlerts: true,
    emailReports: true,
    emailUpdates: false,
    pushAnomalies: true,
    pushGoals: true,
    dataRetention: '90d',
    backupFrequency: 'weekly',
    chartStyle: 'modern',
    animations: true,
    reducedMotion: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For appearance settings, the theme is already saved via the context
      if (section === 'Appearance') {
        toast({
          title: "Appearance settings saved",
          description: `Theme and appearance preferences have been updated successfully.`,
        });
      } else {
        toast({
          title: "Settings saved",
          description: `${section} settings have been updated successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    setIsLoading(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Export completed",
        description: `${type} data has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your dashboard preferences and configurations</p>
            </div>
            <div className="hidden lg:block">
              <RealTimeClock />
            </div>
          </div>
          {/* Mobile clock - shows below title on smaller screens */}
          <div className="lg:hidden mt-4">
            <RealTimeClock />
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
            <TabsTrigger value="general" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Notify</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Database className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Theme</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>Configure your dashboard settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-name">Dashboard Name</Label>
                    <Input 
                      id="dashboard-name" 
                      value={formData.dashboardName}
                      onChange={(e) => handleInputChange('dashboardName', e.target.value)}
                      placeholder="AI Analytics Dashboard" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="cet">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                      <p className="text-sm text-muted-foreground">Automatically refresh data every 30 seconds</p>
                    </div>
                    <Switch 
                      id="auto-refresh" 
                      checked={formData.autoRefresh}
                      onCheckedChange={(checked) => handleSwitchChange('autoRefresh', checked)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <Label htmlFor="sound-alerts">Sound Alerts</Label>
                      <p className="text-sm text-muted-foreground">Play sounds for important notifications</p>
                    </div>
                    <Switch 
                      id="sound-alerts" 
                      checked={formData.soundAlerts}
                      onCheckedChange={(checked) => handleSwitchChange('soundAlerts', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('General')} disabled={isLoading} className="min-w-[120px]">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input 
                      id="first-name" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input 
                      id="last-name" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@example.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..." 
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Profile')} disabled={isLoading} className="min-w-[120px]">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      id="two-factor" 
                      checked={formData.twoFactor}
                      onCheckedChange={(checked) => handleSwitchChange('twoFactor', checked)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <Label htmlFor="session-timeout">Auto Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <Switch 
                      id="session-timeout" 
                      checked={formData.sessionTimeout}
                      onCheckedChange={(checked) => handleSwitchChange('sessionTimeout', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Security')} disabled={isLoading} className="min-w-[120px]">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Update Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <Label htmlFor="email-alerts">Performance Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when metrics exceed thresholds</p>
                      </div>
                      <Switch 
                        id="email-alerts" 
                        checked={formData.emailAlerts}
                        onCheckedChange={(checked) => handleSwitchChange('emailAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <Label htmlFor="email-reports">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly analytics summaries</p>
                      </div>
                      <Switch 
                        id="email-reports" 
                        checked={formData.emailReports}
                        onCheckedChange={(checked) => handleSwitchChange('emailReports', checked)}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <Label htmlFor="email-updates">Product Updates</Label>
                        <p className="text-sm text-muted-foreground">Stay informed about new features</p>
                      </div>
                      <Switch 
                        id="email-updates" 
                        checked={formData.emailUpdates}
                        onCheckedChange={(checked) => handleSwitchChange('emailUpdates', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <Label htmlFor="push-anomalies">Anomaly Detection</Label>
                        <p className="text-sm text-muted-foreground">Instant alerts for unusual patterns</p>
                      </div>
                      <Switch 
                        id="push-anomalies" 
                        checked={formData.pushAnomalies}
                        onCheckedChange={(checked) => handleSwitchChange('pushAnomalies', checked)}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <Label htmlFor="push-goals">Goal Achievements</Label>
                        <p className="text-sm text-muted-foreground">Celebrate when targets are met</p>
                      </div>
                      <Switch 
                        id="push-goals" 
                        checked={formData.pushGoals}
                        onCheckedChange={(checked) => handleSwitchChange('pushGoals', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Notifications')} disabled={isLoading} className="min-w-[120px]">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Settings */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Control data retention, backups, and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention Period</Label>
                    <Select value={formData.dataRetention} onValueChange={(value) => handleInputChange('dataRetention', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="90d">90 Days</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select value={formData.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Export Options</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('All Data')}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export All Data
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('Analytics')}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('User Data')}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export User Data
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground text-destructive">Danger Zone</h4>
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h5 className="font-medium text-destructive">Delete All Data</h5>
                        <p className="text-sm text-muted-foreground">Permanently delete all dashboard data. This action cannot be undone.</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Data
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Data')} disabled={isLoading} className="min-w-[120px]">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'auto')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="auto">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Auto
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Current theme: {actualTheme === 'dark' ? 'Dark' : 'Light'}
                      {theme === 'auto' && ' (System)'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chart-style">Chart Style</Label>
                    <Select value={formData.chartStyle} onValueChange={(value) => handleInputChange('chartStyle', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chart style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <Label htmlFor="animations">Enable Animations</Label>
                      <p className="text-sm text-muted-foreground">Use smooth transitions and effects</p>
                    </div>
                    <Switch 
                      id="animations" 
                      checked={formData.animations}
                      onCheckedChange={(checked) => handleSwitchChange('animations', checked)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <Label htmlFor="reduced-motion">Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
                    </div>
                    <Switch 
                      id="reduced-motion" 
                      checked={formData.reducedMotion}
                      onCheckedChange={(checked) => handleSwitchChange('reducedMotion', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Appearance')} disabled={isLoading} className="min-w-[120px]">
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Appearance'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;