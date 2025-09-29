import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Star, Calendar, Users, BarChart3, History, Coffee, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CuppingSessionForm } from '@/components/cupping/CuppingSessionForm';
import { CuppingEvaluationForm } from '@/components/cupping/CuppingEvaluationForm';
import { CuppingEvaluationView } from '@/components/cupping/CuppingEvaluationView';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { Database } from "@/integrations/supabase/types";

type CuppingSession = Database['public']['Tables']['cupping_sessions']['Row'];

export default function Cupping() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CuppingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [viewingEvaluations, setViewingEvaluations] = useState(false);

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

  if (showForm) {
    return (
      <div className="space-y-6 pb-20 md:pb-6">
        <CuppingSessionForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (showEvaluationForm && selectedSessionId) {
    return (
      <div className="space-y-6 pb-20 md:pb-6">
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
      <div className="space-y-6 pb-20 md:pb-6">
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
    <div className="space-y-6 pb-20 md:pb-6">
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
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Cupping Session
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="history">Cupping History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                <CardContent className="py-8 text-center">
                  <Coffee className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Cupping Sessions</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating your first cupping session.
                  </p>
                  <Button className="mt-4 bg-accent hover:bg-accent/90" onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Session
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Cupping History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Historical cupping sessions will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Cupping Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">Score distribution chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Regional Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">Regional performance chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">Trend analysis chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}