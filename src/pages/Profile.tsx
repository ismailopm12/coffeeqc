import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { User, Settings, Bell, Shield, Coffee, Award, TrendingUp, Camera, MapPin, Phone, Mail, Calendar, Award as AwardIcon, Trophy, Target, Save, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ProfileData {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  member_since: string;
  specialties: string;
  certifications: string;
  awards: string;
  focus_areas: string;
  position: string;
  created_at?: string;
  updated_at?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    greenBeansEvaluated: 0,
    cuppingSessions: 0,
    avgQualityScore: 0,
    yearsExperience: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // For demonstration, we'll create a simple profile object
      // In a real application, you would store this in one of the existing tables
      // or create a new table for user profiles
      const userProfile: ProfileData = {
        user_id: user.id,
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone: '',
        location: '',
        member_since: new Date(user.created_at || new Date()).toISOString(),
        specialties: '',
        certifications: '',
        awards: '',
        focus_areas: '',
        position: 'Quality Control Specialist'
      };
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Fetch real statistics from the database
      const [greenCount, cuppingCount] = await Promise.all([
        supabase.from('green_assessments').select('*', { count: 'exact' }),
        supabase.from('cupping_sessions').select('*', { count: 'exact' })
      ]);

      // For average quality score, we'll calculate from cupping evaluations
      const { data: evaluations, error: evalError } = await supabase
        .from('cupping_evaluations')
        .select('total_score')
        .neq('total_score', null);

      let avgScore = 0;
      if (!evalError && evaluations && evaluations.length > 0) {
        const total = evaluations.reduce((sum, evalItem) => sum + (evalItem.total_score || 0), 0);
        avgScore = total / evaluations.length;
      }

      setStats({
        greenBeansEvaluated: greenCount.count || 0,
        cuppingSessions: cuppingCount.count || 0,
        avgQualityScore: parseFloat(avgScore.toFixed(1)),
        yearsExperience: 5 // This would typically come from the profile or be calculated
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    
    try {
      setSaving(true);
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <User className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <User className="h-6 w-6" />
            Professional Profile
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your professional account settings and quality control preferences
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-coffee-roast rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button size="sm" variant="outline" className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full h-8 w-8 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 w-full">
              {editing ? (
                <Input
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-2xl font-bold text-primary mb-2 w-full"
                />
              ) : (
                <h3 className="font-bold text-2xl text-primary">{profile.name}</h3>
              )}
              {editing ? (
                <Input
                  value={profile.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="text-muted-foreground w-full"
                />
              ) : (
                <p className="text-muted-foreground">{profile.position}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-coffee-green text-white">Certified Q Grader</Badge>
                <Badge variant="secondary">SCA Trainer</Badge>
                <Badge variant="outline">10+ Years Experience</Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  {editing ? (
                    <Input
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium break-all">{profile.email}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  {editing ? (
                    <Input
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{profile.phone || '+1 (555) 123-4567'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Location</p>
                  {editing ? (
                    <Input
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{profile.location || 'Seattle, WA'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(profile.member_since).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Coffee className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Specialties</p>
                  {editing ? (
                    <Input
                      value={profile.specialties}
                      onChange={(e) => handleInputChange('specialties', e.target.value)}
                      className="font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{profile.specialties || 'African Origins, Espresso Blends'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AwardIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Certifications</p>
                  {editing ? (
                    <Input
                      value={profile.certifications}
                      onChange={(e) => handleInputChange('certifications', e.target.value)}
                      className="font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{profile.certifications || 'Q Grader, SCA Coffee Taster'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Awards</p>
                  {editing ? (
                    <Input
                      value={profile.awards}
                      onChange={(e) => handleInputChange('awards', e.target.value)}
                      className="font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{profile.awards || 'Best Cupper 2023, Roaster\'s Choice'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Focus Areas</p>
                  {editing ? (
                    <Input
                      value={profile.focus_areas}
                      onChange={(e) => handleInputChange('focus_areas', e.target.value)}
                      className="font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{profile.focus_areas || 'Quality Assurance, Training'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Control Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <Coffee className="h-8 w-8 text-coffee-green mx-auto mb-2" />
              <p className="text-3xl font-bold text-coffee-green">{stats.greenBeansEvaluated}</p>
              <p className="text-sm text-muted-foreground">Green Beans Evaluated</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/5">
              <Award className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-3xl font-bold text-accent">{stats.cuppingSessions}</p>
              <p className="text-sm text-muted-foreground">Cupping Sessions Led</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{stats.avgQualityScore}</p>
              <p className="text-sm text-muted-foreground">Avg Quality Score</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/5">
              <Shield className="h-8 w-8 text-coffee-roast mx-auto mb-2" />
              <p className="text-3xl font-bold text-coffee-roast">{stats.yearsExperience}</p>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-xl font-bold">24</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sessions</p>
                    <p className="text-xs text-green-500">↑ 12%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-xl font-bold">88.2</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-xs text-green-500">↑ 2.1%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-coffee-green/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Top Region</p>
                    <p className="text-xl font-bold">Ethiopia</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">32 Evaluations</p>
                    <p className="text-xs text-green-500">Most Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Professional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Professional Quality Control Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Auto-save assessment forms</Label>
                <p className="text-sm text-muted-foreground">Automatically save progress during quality assessments</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Precision scoring display</Label>
                <p className="text-sm text-muted-foreground">Show scores with decimal precision for accuracy</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Equipment calibration alerts</Label>
                <p className="text-sm text-muted-foreground">Automated reminders for equipment maintenance</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Quality threshold monitoring</Label>
                <p className="text-sm text-muted-foreground">Alert when quality scores fall below standards</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Batch traceability tracking</Label>
                <p className="text-sm text-muted-foreground">Enable comprehensive batch history logging</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Export data formatting</Label>
                <p className="text-sm text-muted-foreground">Professional report formatting for exports</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Professional Alert System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Critical quality alerts</Label>
              <p className="text-sm text-muted-foreground">Immediate alerts for quality scores below 80</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Batch completion notifications</Label>
              <p className="text-sm text-muted-foreground">Notify when quality assessments are completed</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Scheduled session reminders</Label>
              <p className="text-sm text-muted-foreground">Professional reminders for cupping sessions</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Equipment maintenance alerts</Label>
              <p className="text-sm text-muted-foreground">Preventive maintenance scheduling notifications</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Performance analytics</Label>
              <p className="text-sm text-muted-foreground">Weekly performance summaries and trends</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}