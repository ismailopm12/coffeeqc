import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  Coffee, 
  Flame, 
  FileText, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Home,
  Users,
  Palette,
  History
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminGuard from "@/components/admin/AdminGuard";
import UserManagement from "@/components/admin/UserManagement";
import FrontendCustomization from "@/components/admin/FrontendCustomization";
import FrontendHistory from "@/components/admin/FrontendHistory";
import { EditGreenAssessmentForm } from "@/components/admin/EditGreenAssessmentForm";
import { EditRoastProfileForm } from "@/components/admin/EditRoastProfileForm";
import { EditCuppingSessionForm } from "@/components/admin/EditCuppingSessionForm";
import { GreenAssessmentForm } from "@/components/green/GreenAssessmentForm";
import { RoastProfileForm } from "@/components/roast/RoastProfileForm";
import { CuppingSessionForm } from "@/components/cupping/CuppingSessionForm";
import { useNavigate, useLocation } from 'react-router-dom';

type GreenAssessment = Database['public']['Tables']['green_assessments']['Row'];
type RoastProfile = Database['public']['Tables']['roast_profiles']['Row'];
type CuppingSession = Database['public']['Tables']['cupping_sessions']['Row'];

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(() => {
    // Set default tab based on URL
    const path = location.pathname;
    if (path.includes('/users')) return 'users';
    if (path.includes('/green')) return 'green';
    if (path.includes('/roast')) return 'roast';
    if (path.includes('/cupping')) return 'cupping';
    if (path.includes('/history')) return 'history';
    if (path.includes('/customization')) return 'customization';
    return 'dashboard'; // default
  });
  const [greenAssessments, setGreenAssessments] = useState<GreenAssessment[]>([]);
  const [roastProfiles, setRoastProfiles] = useState<RoastProfile[]>([]);
  const [cuppingSessions, setCuppingSessions] = useState<CuppingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for creating new records
  const [creatingGreenAssessment, setCreatingGreenAssessment] = useState(false);
  const [creatingRoastProfile, setCreatingRoastProfile] = useState(false);
  const [creatingCuppingSession, setCreatingCuppingSession] = useState(false);
  
  // State for editing records
  const [editingGreenAssessment, setEditingGreenAssessment] = useState<GreenAssessment | null>(null);
  const [editingRoastProfile, setEditingRoastProfile] = useState<RoastProfile | null>(null);
  const [editingCuppingSession, setEditingCuppingSession] = useState<CuppingSession | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      switch (activeTab) {
        case "dashboard":
          // Dashboard stats are handled by the dashboard component
          break;
        case "users":
          // User management has its own data fetching
          break;
        case "green":
          await fetchGreenAssessments();
          break;
        case "roast":
          await fetchRoastProfiles();
          break;
        case "cupping":
          await fetchCuppingSessions();
          break;
        case "history":
          // History tab has its own data fetching
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data for admin panel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGreenAssessments = async () => {
    try {
      // For admins, we can access all data by bypassing RLS
      // This requires using a service role key or special permissions
      let query = supabase.from('green_assessments').select('*');
      
      if (searchTerm) {
        query = query.or(`lot_number.ilike.%${searchTerm}%,origin.ilike.%${searchTerm}%`);
      }
      
      // Order by created_at descending
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setGreenAssessments(data || []);
    } catch (error) {
      console.error('Error fetching green assessments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch green assessments: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoastProfiles = async () => {
    try {
      // For admins, we can access all data by bypassing RLS
      let query = supabase.from('roast_profiles').select('*');
      
      if (searchTerm) {
        query = query.or(`profile_name.ilike.%${searchTerm}%,roast_level.ilike.%${searchTerm}%`);
      }
      
      // Order by created_at descending
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setRoastProfiles(data || []);
    } catch (error) {
      console.error('Error fetching roast profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roast profiles: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCuppingSessions = async () => {
    try {
      // For admins, we can access all data by bypassing RLS
      let query = supabase.from('cupping_sessions').select('*');
      
      if (searchTerm) {
        query = query.or(`session_name.ilike.%${searchTerm}%,cupper_name.ilike.%${searchTerm}%`);
      }
      
      // Order by created_at descending
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setCuppingSessions(data || []);
    } catch (error) {
      console.error('Error fetching cupping sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cupping sessions: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGreenAssessment = async (id: string) => {
    try {
      // Admins can delete any green assessment
      const { error } = await supabase
        .from('green_assessments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Green assessment deleted successfully"
      });
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete green assessment: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteRoastProfile = async (id: string) => {
    try {
      // Admins can delete any roast profile
      const { error } = await supabase
        .from('roast_profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Roast profile deleted successfully"
      });
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete roast profile: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCuppingSession = async (id: string) => {
    try {
      // Admins can delete any cupping session
      const { error } = await supabase
        .from('cupping_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cupping session deleted successfully"
      });
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cupping session: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleEditGreenAssessment = (assessment: GreenAssessment) => {
    setEditingGreenAssessment(assessment);
  };

  const handleEditRoastProfile = (profile: RoastProfile) => {
    setEditingRoastProfile(profile);
  };

  const handleEditCuppingSession = (session: CuppingSession) => {
    setEditingCuppingSession(session);
  };

  // Handle create success
  const handleCreateSuccess = () => {
    setCreatingGreenAssessment(false);
    setCreatingRoastProfile(false);
    setCreatingCuppingSession(false);
    fetchData();
  };

  // Handle create cancel
  const handleCreateCancel = () => {
    setCreatingGreenAssessment(false);
    setCreatingRoastProfile(false);
    setCreatingCuppingSession(false);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setEditingGreenAssessment(null);
    setEditingRoastProfile(null);
    setEditingCuppingSession(null);
    fetchData();
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingGreenAssessment(null);
    setEditingRoastProfile(null);
    setEditingCuppingSession(null);
  };

  // Handle add new button click
  const handleAddNew = () => {
    switch (activeTab) {
      case 'green':
        setCreatingGreenAssessment(true);
        break;
      case 'roast':
        setCreatingRoastProfile(true);
        break;
      case 'cupping':
        setCreatingCuppingSession(true);
        break;
      default:
        // Do nothing for other tabs
        break;
    }
  };

  // Render create forms
  if (creatingGreenAssessment) {
    return (
      <div className="space-y-6">
        <GreenAssessmentForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </div>
    );
  }

  if (creatingRoastProfile) {
    return (
      <div className="space-y-6">
        <RoastProfileForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </div>
    );
  }

  if (creatingCuppingSession) {
    return (
      <div className="space-y-6">
        <CuppingSessionForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </div>
    );
  }

  // Render edit forms
  if (editingGreenAssessment) {
    return (
      <div className="space-y-6">
        <EditGreenAssessmentForm
          assessment={editingGreenAssessment}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  if (editingRoastProfile) {
    return (
      <div className="space-y-6">
        <EditRoastProfileForm
          profile={editingRoastProfile}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  if (editingCuppingSession) {
    return (
      <div className="space-y-6">
        <EditCuppingSessionForm
          session={editingCuppingSession}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Please log in to access the admin panel.</p>
      </div>
    );
  }

  // Update the Tabs component to use proper routing
  return (
    <AdminGuard>
      <div className="space-y-6 pb-28 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your coffee quality control system</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center gap-2" onClick={() => navigate('/admin')}>
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2" onClick={() => navigate('/admin/users')}>
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="green" className="flex items-center gap-2" onClick={() => navigate('/admin/green')}>
              <Coffee className="h-4 w-4" />
              <span className="hidden sm:inline">Green</span>
            </TabsTrigger>
            <TabsTrigger value="roast" className="flex items-center gap-2" onClick={() => navigate('/admin/roast')}>
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Roast</span>
            </TabsTrigger>
            <TabsTrigger value="cupping" className="flex items-center gap-2" onClick={() => navigate('/admin/cupping')}>
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Cupping</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2" onClick={() => navigate('/admin/history')}>
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="customization" className="flex items-center gap-2" onClick={() => navigate('/admin/customization')}>
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Custom</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <AdminDashboard />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          {/* Green Assessments Tab */}
          <TabsContent value="green" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span>Green Coffee Assessments</span>
                  <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search assessments..." 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </form>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lot Number</TableHead>
                          <TableHead>Origin</TableHead>
                          <TableHead>Variety</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Moisture</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {greenAssessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.lot_number}</TableCell>
                            <TableCell>{assessment.origin}</TableCell>
                            <TableCell>{assessment.variety || '-'}</TableCell>
                            <TableCell>
                              <Badge>{assessment.grade || 'N/A'}</Badge>
                            </TableCell>
                            <TableCell>{assessment.moisture_content || '-'}</TableCell>
                            <TableCell>{assessment.assessment_date ? new Date(assessment.assessment_date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditGreenAssessment(assessment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => assessment.id && handleDeleteGreenAssessment(assessment.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roast Profiles Tab */}
          <TabsContent value="roast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span>Roast Profiles</span>
                  <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search profiles..." 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </form>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Profile Name</TableHead>
                          <TableHead>Batch Size</TableHead>
                          <TableHead>Roast Level</TableHead>
                          <TableHead>Total Time</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roastProfiles.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell className="font-medium">{profile.profile_name}</TableCell>
                            <TableCell>{profile.batch_size || '-'}</TableCell>
                            <TableCell>{profile.roast_level || '-'}</TableCell>
                            <TableCell>{profile.total_roast_time ? `${profile.total_roast_time}s` : '-'}</TableCell>
                            <TableCell>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditRoastProfile(profile)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => profile.id && handleDeleteRoastProfile(profile.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cupping Sessions Tab */}
          <TabsContent value="cupping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span>Cupping Sessions</span>
                  <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search sessions..." 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </form>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session Name</TableHead>
                          <TableHead>Cupper</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Evaluations</TableHead>
                          <TableHead>Avg Score</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cuppingSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">{session.session_name}</TableCell>
                            <TableCell>{session.cupper_name || '-'}</TableCell>
                            <TableCell>{session.cupping_date ? new Date(session.cupping_date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{session.created_at ? new Date(session.created_at).toLocaleDateString() : '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditCuppingSession(session)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => session.id && handleDeleteCuppingSession(session.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Frontend History Tab */}
          <TabsContent value="history" className="space-y-4">
            <FrontendHistory />
          </TabsContent>

          {/* Frontend Customization Tab */}
          <TabsContent value="customization" className="space-y-4">
            <FrontendCustomization />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
};

export default Admin;