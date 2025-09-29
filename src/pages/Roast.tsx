import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Plus, Thermometer, Clock, Target, BarChart3, History, Calendar, Download, Edit, Trash2, Copy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoastProfileForm } from '@/components/roast/RoastProfileForm';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type RoastProfile = Database['public']['Tables']['roast_profiles']['Row'];

export default function Roast() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<RoastProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<RoastProfile | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfiles();
  }, [user, navigate]);

  const loadProfiles = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('roast_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading profiles",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProfile(null);
    loadProfiles();
  };

  const handleEdit = (profile: RoastProfile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this roast profile? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('roast_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Profile Deleted",
        description: "Roast profile deleted successfully.",
      });

      loadProfiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (profile: RoastProfile) => {
    try {
      // Create a new profile based on the existing one
      const newProfile = {
        user_id: profile.user_id,
        profile_name: `Copy of ${profile.profile_name}`,
        green_assessment_id: profile.green_assessment_id,
        batch_size: profile.batch_size,
        preheat_temp: profile.preheat_temp,
        charge_temp: profile.charge_temp,
        first_crack_time: profile.first_crack_time,
        first_crack_temp: profile.first_crack_temp,
        development_time: profile.development_time,
        drop_temp: profile.drop_temp,
        total_roast_time: profile.total_roast_time,
        roast_level: profile.roast_level,
        notes: profile.notes
      };
      
      const { error } = await supabase
        .from('roast_profiles')
        .insert(newProfile);

      if (error) throw error;

      toast({
        title: "Profile Duplicated",
        description: "Roast profile duplicated successfully.",
      });

      loadProfiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate profile: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const exportData = async () => {
    const csvData = profiles.map(profile => ({
      'Profile Name': profile.profile_name,
      'Batch Size (kg)': profile.batch_size || '',
      'Preheat Temp (°C)': profile.preheat_temp || '',
      'Charge Temp (°C)': profile.charge_temp || '',
      'First Crack Time (s)': profile.first_crack_time || '',
      'First Crack Temp (°C)': profile.first_crack_temp || '',
      'Development Time (s)': profile.development_time || '',
      'Drop Temp (°C)': profile.drop_temp || '',
      'Total Roast Time (s)': profile.total_roast_time || '',
      'Roast Level': profile.roast_level || '',
      'Created Date': new Date(profile.created_at || '').toLocaleDateString(),
      'Notes': profile.notes || ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roast_profiles_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Roast profiles exported successfully!",
    });
  };

  if (showForm) {
    return (
      <div className="space-y-6 pb-28 md:pb-6">
        <RoastProfileForm
          profile={editingProfile}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingProfile(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-coffee-roast flex items-center gap-2">
            <Flame className="h-6 w-6" />
            Roast Quality Control
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Professional roast profile management and quality assessment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData} disabled={profiles.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-coffee-roast hover:bg-coffee-roast/90" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Roast Profile
          </Button>
        </div>
      </div>

      {/* Quality Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-coffee-roast" />
              <div>
                <p className="text-sm font-medium text-coffee-roast">Total Profiles</p>
                <p className="text-2xl font-bold">{profiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">This Month</p>
                <p className="text-2xl font-bold">
                  {profiles.filter(p => new Date(p.created_at || '').getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-accent">This Week</p>
                <p className="text-2xl font-bold">
                  {profiles.filter(p => {
                    const profileDate = new Date(p.created_at || '');
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return profileDate >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profiles List */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading roast profiles...</p>
          </CardContent>
        </Card>
      ) : profiles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No roast profiles yet. Create your first profile to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-warm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-coffee-roast">{profile.profile_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {profile.batch_size ? `Batch Size: ${profile.batch_size}kg` : 'Batch size not specified'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{profile.roast_level || 'Level not specified'}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Charge Temp</p>
                    <p className="font-medium">{profile.charge_temp ? `${profile.charge_temp}°C` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">First Crack</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {profile.first_crack_time ? `${Math.floor(profile.first_crack_time / 60)}:${String(profile.first_crack_time % 60).padStart(2, '0')}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Drop Temp</p>
                    <p className="font-medium flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      {profile.drop_temp ? `${profile.drop_temp}°C` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Time</p>
                    <p className="font-medium flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {profile.total_roast_time ? `${Math.floor(profile.total_roast_time / 60)}:${String(profile.total_roast_time % 60).padStart(2, '0')}` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Development: </span>
                    <span className="font-medium">
                      {profile.development_time ? `${Math.floor(profile.development_time / 60)}:${String(profile.development_time % 60).padStart(2, '0')}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(profile)}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicate(profile)}>
                      <Copy className="mr-2 h-3 w-3" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(profile.id!)}>
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
                {profile.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{profile.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}