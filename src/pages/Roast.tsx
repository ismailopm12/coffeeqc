import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Plus, Thermometer, Clock, Target, BarChart3, History, Calendar, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoastProfileForm } from '@/components/roast/RoastProfileForm';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const roastProfiles = [
  {
    id: 1,
    name: "Ethiopian Light Roast",
    bean: "Ethiopian Sidamo",
    roastLevel: "Light",
    duration: "12:30",
    firstCrack: "9:45",
    endTemp: "196°C",
    developmentRatio: "18.5%",
    qualityScore: 88.2,
    batchSize: "5kg",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Colombian Medium",
    bean: "Colombian Huila", 
    roastLevel: "Medium",
    duration: "14:15",
    firstCrack: "10:20",
    endTemp: "210°C",
    developmentRatio: "20.2%",
    qualityScore: 86.7,
    batchSize: "10kg",
    date: "2024-01-18"
  },
  {
    id: 3,
    name: "Guatemala Dark Roast",
    bean: "Guatemala Antigua",
    roastLevel: "Medium-Dark",
    duration: "15:45",
    firstCrack: "11:10",
    endTemp: "225°C",
    developmentRatio: "22.1%",
    qualityScore: 85.5,
    batchSize: "8kg",
    date: "2024-01-20"
  }
];

const roastHistory = [
  {
    date: "2024-01-12",
    profile: "Brazilian Pulped Natural",
    roastLevel: "Medium",
    qualityScore: 84.0,
    batchSize: "12kg",
    notes: "Slightly overdeveloped, reduce time by 30s"
  },
  {
    date: "2024-01-10",
    profile: "Kenya AA Natural Process",
    roastLevel: "Light-Medium", 
    qualityScore: 89.5,
    batchSize: "6kg",
    notes: "Perfect development, replicate parameters"
  },
  {
    date: "2024-01-08",
    profile: "Panama Geisha Washed",
    roastLevel: "Light",
    qualityScore: 92.0,
    batchSize: "3kg",
    notes: "Exceptional clarity, premium grade"
  }
];

export default function Roast() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
    loadProfiles();
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
      'Created Date': new Date(profile.created_at).toLocaleDateString(),
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
      <div className="space-y-6 pb-20 md:pb-6">
        <RoastProfileForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
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
                  {profiles.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length}
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
                    const profileDate = new Date(p.created_at);
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
                      Created: {new Date(profile.created_at).toLocaleDateString()}
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
                    <Button variant="outline" size="sm">Edit Profile</Button>
                    <Button variant="outline" size="sm">Duplicate</Button>
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