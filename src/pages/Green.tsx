import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Plus, Search, Filter, Calendar, FileText, BarChart3, History, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GreenAssessmentForm } from '@/components/green/GreenAssessmentForm';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface GreenAssessment {
  id: string;
  lot_number: string;
  origin: string;
  variety?: string;
  process?: string;
  moisture_content?: number;
  density?: number;
  screen_size?: string;
  defects_primary: number;
  defects_secondary: number;
  grade?: string;
  notes?: string;
  assessment_date: string;
  created_at: string;
}

export default function Green() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<GreenAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadAssessments();
  }, [user, navigate]);

  const loadAssessments = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('green_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading assessments",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAssessments(data || []);
    }
    setLoading(false);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadAssessments();
  };

  const exportData = async () => {
    const csvData = assessments.map(assessment => ({
      'Lot Number': assessment.lot_number,
      'Origin': assessment.origin,
      'Variety': assessment.variety || '',
      'Process': assessment.process || '',
      'Moisture Content': assessment.moisture_content || '',
      'Density': assessment.density || '',
      'Screen Size': assessment.screen_size || '',
      'Primary Defects': assessment.defects_primary,
      'Secondary Defects': assessment.defects_secondary,
      'Grade': assessment.grade || '',
      'Assessment Date': new Date(assessment.assessment_date).toLocaleDateString(),
      'Notes': assessment.notes || ''
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `green_assessments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Green bean assessments exported successfully!",
    });
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.lot_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (assessment.variety && assessment.variety.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (showForm) {
    return (
      <div className="space-y-6 pb-20 md:pb-6">
        <GreenAssessmentForm
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
          <h1 className="text-2xl font-bold text-coffee-green flex items-center gap-2">
            <Coffee className="h-6 w-6" />
            Green Bean Quality Control
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Professional green coffee bean analysis and quality assessment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData} disabled={assessments.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-coffee-green hover:bg-coffee-green/90" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Quality Assessment
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by origin, lot number, variety..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quality Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-coffee-green" />
              <div>
                <p className="text-sm font-medium text-coffee-green">Total Assessments</p>
                <p className="text-2xl font-bold">{assessments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">This Month</p>
                <p className="text-2xl font-bold">
                  {assessments.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-accent">This Week</p>
                <p className="text-2xl font-bold">
                  {assessments.filter(a => {
                    const assessmentDate = new Date(a.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return assessmentDate >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments List */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading assessments...</p>
          </CardContent>
        </Card>
      ) : filteredAssessments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No assessments found matching your search." : "No green bean assessments yet. Create your first assessment to get started!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-warm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-coffee-green">{assessment.origin}</CardTitle>
                    <p className="text-sm text-muted-foreground">Lot: {assessment.lot_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {assessment.variety && `Variety: ${assessment.variety}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{assessment.grade || 'Ungraded'}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Process</p>
                    <p className="font-medium">{assessment.process || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Moisture</p>
                    <p className="font-medium">{assessment.moisture_content ? `${assessment.moisture_content}%` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Density</p>
                    <p className="font-medium">{assessment.density ? `${assessment.density} g/ml` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Screen Size</p>
                    <p className="font-medium">{assessment.screen_size || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Defects: </span>
                    <span className="font-medium">
                      {assessment.defects_primary + assessment.defects_secondary} total
                    </span>
                    <span className="text-muted-foreground ml-4">Date: </span>
                    <span className="font-medium">
                      {new Date(assessment.assessment_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Assessment
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-3 w-3" />
                      View Report
                    </Button>
                  </div>
                </div>
                {assessment.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{assessment.notes}</p>
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