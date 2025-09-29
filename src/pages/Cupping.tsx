import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Star, Calendar, Users, BarChart3, History, Coffee, Download, Eye, Edit, Trash2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CuppingSessionForm } from '@/components/cupping/CuppingSessionForm';
import { CuppingEvaluationForm } from '@/components/cupping/CuppingEvaluationForm';
import { CuppingEvaluationView } from '@/components/cupping/CuppingEvaluationView';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { Database } from "@/integrations/supabase/types";

type CuppingSession = Database['public']['Tables']['cupping_sessions']['Row'];
type CuppingEvaluation = Database['public']['Tables']['cupping_evaluations']['Row'];

export default function Cupping() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CuppingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<CuppingSession | null>(null);
  const [viewingEvaluations, setViewingEvaluations] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<CuppingEvaluation[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadSessions();
  }, [user, navigate]);

  const loadSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cupping_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading cupping sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load cupping sessions: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // New function to load analytics data
  const loadAnalyticsData = async () => {
    if (!user || sessions.length === 0) return;
    
    setAnalyticsLoading(true);
    try {
      // Get session IDs
      const sessionIds = sessions.map(s => s.id!);
      
      // Load cupping evaluations for the user's sessions
      const { data: evaluations, error: evalError } = await supabase
        .from('cupping_evaluations')
        .select('*')
        .in('cupping_session_id', sessionIds)
        .order('created_at', { ascending: false });

      if (evalError) throw evalError;
      
      setAnalyticsData(evaluations || []);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadSessions();
  };

  const handleEvaluationSuccess = () => {
    setShowEvaluationForm(false);
    loadSessions();
  };

  const handleViewEvaluations = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setViewingEvaluations(true);
  };

  const handleAddEvaluation = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowEvaluationForm(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this cupping session? This will also delete all evaluations in this session. This action cannot be undone.');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('cupping_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session Deleted",
        description: "Cupping session deleted successfully.",
      });

      loadSessions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // New function to handle editing a session
  const handleEditSession = (session: CuppingSession) => {
    setSelectedSession(session);
    setShowEditForm(true);
  };

  // New function to handle updating a session
  const handleUpdateSession = async (updatedData: Partial<CuppingSession>) => {
    if (!selectedSession) return;

    try {
      const { error } = await supabase
        .from('cupping_sessions')
        .update(updatedData)
        .eq('id', selectedSession.id);

      if (error) throw error;

      toast({
        title: "Session Updated",
        description: "Cupping session updated successfully.",
      });

      setShowEditForm(false);
      setSelectedSession(null);
      loadSessions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update session: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // New function to handle adding a new cupping session
  const handleAddNewSession = () => {
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="space-y-6 pb-28 md:pb-6">
        <CuppingSessionForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  // New form for editing sessions
  if (showEditForm && selectedSession) {
    return (
      <div className="space-y-6 pb-28 md:pb-6">
        <EditCuppingSessionForm
          session={selectedSession}
          onUpdate={handleUpdateSession}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedSession(null);
          }}
        />
      </div>
    );
  }

  if (showEvaluationForm && selectedSessionId) {
    return (
      <div className="space-y-6 pb-28 md:pb-6">
        <CuppingEvaluationForm
          sessionId={selectedSessionId}
          onSuccess={handleEvaluationSuccess}
          onCancel={() => setShowEvaluationForm(false)}
        />
      </div>
    );
  }

  if (viewingEvaluations && selectedSessionId) {
    return (
      <div className="space-y-6 pb-28 md:pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">Cupping Evaluations</h1>
          <Button onClick={() => setViewingEvaluations(false)} variant="outline">
            Back to Sessions
          </Button>
        </div>
        <CuppingEvaluationView sessionId={selectedSessionId} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Cupping Quality Control
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Professional cupping sessions and sensory evaluation management
          </p>
        </div>
        <div className="flex gap-2">
          {/* Small mobile-responsive button for new quality assessment */}
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground md:hidden" 
            size="sm"
            onClick={handleAddNewSession}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground hidden md:inline-flex" 
            onClick={handleAddNewSession}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Cupping Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">Cupping History</TabsTrigger>
          <TabsTrigger value="analytics" onClick={loadAnalyticsData}>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-accent">Avg Quality</p>
                    <p className="text-2xl font-bold">87.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Coffee className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-primary">Sessions</p>
                    <p className="text-2xl font-bold">{sessions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-coffee-green/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-coffee-green" />
                  <div>
                    <p className="text-sm font-medium text-coffee-green">Active Cuppers</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-coffee-roast/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-coffee-roast" />
                  <div>
                    <p className="text-sm font-medium text-coffee-roast">This Week</p>
                    <p className="text-2xl font-bold">15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Cupping Sessions */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-warm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-accent">{session.session_name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {session.cupping_date ? new Date(session.cupping_date).toLocaleDateString() : 'No date set'}
                        </p>
                        {session.cupper_name && (
                          <Badge variant="outline" className="mt-1">Cupper: {session.cupper_name}</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">87.0</div>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Samples Evaluated</p>
                        <p className="font-medium">5 coffees</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Q Graders</p>
                        <p className="font-medium">3 certified</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Session Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={60} className="h-2 flex-1" />
                          <span className="text-xs">60%</span>
                        </div>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Notes: </span>
                          <span className="font-medium text-accent">{session.notes}</span>
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddEvaluation(session.id!)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Evaluation
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewEvaluations(session.id!)}>
                        <Eye className="mr-2 h-3 w-3" />
                        View Results
                      </Button>
                      {/* New Edit button */}
                      <Button variant="outline" size="sm" onClick={() => handleEditSession(session)}>
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSession(session.id!)}>
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Coffee className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Cupping Sessions</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating your first cupping session.
                  </p>
                  <Button className="mt-4 bg-accent hover:bg-accent/90" onClick={handleAddNewSession}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Session
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Cupping History with real data */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-warm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-accent">{session.session_name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {session.cupping_date ? new Date(session.cupping_date).toLocaleDateString() : 'No date set'}
                        </p>
                        {session.cupper_name && (
                          <Badge variant="outline" className="mt-1">Cupper: {session.cupper_name}</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">87.0</div>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Samples Evaluated</p>
                        <p className="font-medium">5 coffees</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Q Graders</p>
                        <p className="font-medium">3 certified</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Session Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={60} className="h-2 flex-1" />
                          <span className="text-xs">60%</span>
                        </div>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Notes: </span>
                          <span className="font-medium text-accent">{session.notes}</span>
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewEvaluations(session.id!)}>
                        <Eye className="mr-2 h-3 w-3" />
                        View Results
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Cupping History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <History className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Cupping History</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your cupping sessions will appear here once completed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Cupping Analytics with real data */}
          {analyticsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Evaluations</span>
                        <span className="font-bold">{analyticsData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Score</span>
                        <span className="font-bold">
                          {analyticsData.reduce((sum, evalItem) => sum + (evalItem.total_score || 0), 0) / analyticsData.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Highest Score</span>
                        <span className="font-bold">
                          {Math.max(...analyticsData.map(e => e.total_score || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lowest Score</span>
                        <span className="font-bold">
                          {Math.min(...analyticsData.map(e => e.total_score || 100))}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">No analytics data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Regional Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Top Origin</span>
                        <span className="font-bold">
                          {analyticsData
                            .map(e => e.green_origin)
                            .filter(Boolean)
                            .sort((a, b) => 
                              analyticsData.filter(e => e.green_origin === b).length - 
                              analyticsData.filter(e => e.green_origin === a).length
                            )[0] || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Most Common Process</span>
                        <span className="font-bold">
                          {analyticsData
                            .map(e => e.process)
                            .filter(Boolean)
                            .sort((a, b) => 
                              analyticsData.filter(e => e.process === b).length - 
                              analyticsData.filter(e => e.process === a).length
                            )[0] || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">No analytics data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Recent Evaluations</span>
                        <span className="font-bold">{analyticsData.slice(0, 5).length} latest</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {analyticsData.slice(0, 5).map((evalItem, index) => (
                          <div key={index} className="text-center p-2 bg-muted rounded">
                            <div className="font-bold">{evalItem.total_score?.toFixed(1) || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {evalItem.sample_name || 'Sample'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">No analytics data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// New component for editing cupping sessions
function EditCuppingSessionForm({ session, onUpdate, onCancel }: { 
  session: CuppingSession; 
  onUpdate: (data: Partial<CuppingSession>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    session_name: session.session_name || '',
    cupper_name: session.cupper_name || '',
    cupping_date: session.cupping_date || new Date().toISOString().split('T')[0],
    notes: session.notes || '',
    session_type: session.session_type || '',
    location: session.location || '',
    environmental_conditions: session.environmental_conditions || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onUpdate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Edit className="h-5 w-5" />
          Edit Cupping Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session_name">Session Name *</Label>
              <Input
                id="session_name"
                value={formData.session_name}
                onChange={(e) => handleInputChange('session_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cupper_name">Cupper Name</Label>
              <Input
                id="cupper_name"
                value={formData.cupper_name}
                onChange={(e) => handleInputChange('cupper_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session_type">Session Type</Label>
              <Select value={formData.session_type} onValueChange={(value) => handleInputChange('session_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quality-control">Quality Control</SelectItem>
                  <SelectItem value="new-lot-evaluation">New Lot Evaluation</SelectItem>
                  <SelectItem value="comparative-tasting">Comparative Tasting</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cupping_date">Cupping Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cupping_date"
                  type="date"
                  value={formData.cupping_date}
                  onChange={(e) => handleInputChange('cupping_date', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Cupping Lab A, Roastery"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="environmental_conditions">Environmental Conditions</Label>
            <Textarea
              id="environmental_conditions"
              value={formData.environmental_conditions}
              onChange={(e) => handleInputChange('environmental_conditions', e.target.value)}
              rows={2}
              placeholder="Temperature, humidity, atmospheric pressure, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Session Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Session objectives, special instructions, etc..."
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Updating..." : "Update Session"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}