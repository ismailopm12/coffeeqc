import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Coffee, FileText, Download, BarChart3 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type CuppingEvaluation = Database['public']['Tables']['cupping_evaluations']['Row'];

interface CuppingEvaluationViewProps {
  sessionId: string;
}

export function CuppingEvaluationView({ sessionId }: CuppingEvaluationViewProps) {
  const { toast } = useToast();
  const [evaluations, setEvaluations] = useState<CuppingEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, [sessionId]);

  const loadEvaluations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cupping_evaluations')
        .select('*')
        .eq('cupping_session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setEvaluations(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cupping evaluations: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    // Create CSV content with all fields including new profile fields
    const headers = [
      'Sample Name',
      'Kilogram Name',
      'Test Type',
      'Process',
      'TDS (%)',
      'Roast Level',
      'Roast Date',
      'Green Origin',
      'Green Variety',
      'Fragrance/Aroma',
      'Flavor',
      'Aftertaste',
      'Acidity',
      'Body',
      'Balance',
      'Uniformity',
      'Clean Cup',
      'Sweetness',
      'Overall',
      'Defects',
      'Total Score',
      'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...evaluations.map(evaluation => [
        evaluation.sample_name,
        evaluation.kilogram_name || '',
        evaluation.test_type || '',
        evaluation.process || '',
        evaluation.tds || '',
        evaluation.roast_level || '',
        evaluation.roast_date || '',
        evaluation.green_origin || '',
        evaluation.green_variety || '',
        evaluation.fragrance_aroma?.toFixed(1) || '',
        evaluation.flavor?.toFixed(1) || '',
        evaluation.aftertaste?.toFixed(1) || '',
        evaluation.acidity?.toFixed(1) || '',
        evaluation.body?.toFixed(1) || '',
        evaluation.balance?.toFixed(1) || '',
        evaluation.uniformity?.toFixed(1) || '',
        evaluation.clean_cup?.toFixed(1) || '',
        evaluation.sweetness?.toFixed(1) || '',
        evaluation.overall?.toFixed(1) || '',
        evaluation.defects || '',
        evaluation.total_score?.toFixed(1) || '',
        `"${evaluation.notes || ''}"`
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cupping_evaluations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Cupping evaluations exported successfully!",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Coffee className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Evaluations Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No cupping evaluations have been added to this session yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average scores
  const avgScores = evaluations.reduce((acc, evalItem) => {
    acc.fragrance_aroma += evalItem.fragrance_aroma || 0;
    acc.flavor += evalItem.flavor || 0;
    acc.aftertaste += evalItem.aftertaste || 0;
    acc.acidity += evalItem.acidity || 0;
    acc.body += evalItem.body || 0;
    acc.balance += evalItem.balance || 0;
    acc.uniformity += evalItem.uniformity || 0;
    acc.clean_cup += evalItem.clean_cup || 0;
    acc.sweetness += evalItem.sweetness || 0;
    acc.overall += evalItem.overall || 0;
    acc.total_score += evalItem.total_score || 0;
    return acc;
  }, {
    fragrance_aroma: 0,
    flavor: 0,
    aftertaste: 0,
    acidity: 0,
    body: 0,
    balance: 0,
    uniformity: 0,
    clean_cup: 0,
    sweetness: 0,
    overall: 0,
    total_score: 0
  });

  const avgCount = evaluations.length;
  const avgScoresTyped = avgScores as Record<string, number>;
  for (const key in avgScoresTyped) {
    if (Object.prototype.hasOwnProperty.call(avgScoresTyped, key)) {
      avgScoresTyped[key] = avgScoresTyped[key] / avgCount;
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Session Summary
            </span>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{evaluations.length}</div>
              <p className="text-sm text-muted-foreground">Samples</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{avgScoresTyped.total_score.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-coffee-green">{Math.max(...evaluations.map(e => e.total_score || 0)).toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Highest Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-coffee-roast">{Math.min(...evaluations.map(e => e.total_score || 100)).toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Lowest Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{(avgScoresTyped.total_score >= 80 ? 'Excellent' : avgScoresTyped.total_score >= 60 ? 'Good' : 'Fair')}</div>
              <p className="text-sm text-muted-foreground">Quality Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample</TableHead>
                  <TableHead>Kilogram Name</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Process</TableHead>
                  <TableHead>TDS (%)</TableHead>
                  <TableHead>Roast Level</TableHead>
                  <TableHead>Roast Date</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Fragrance/Aroma</TableHead>
                  <TableHead>Flavor</TableHead>
                  <TableHead>Aftertaste</TableHead>
                  <TableHead>Acidity</TableHead>
                  <TableHead>Body</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Uniformity</TableHead>
                  <TableHead>Clean Cup</TableHead>
                  <TableHead>Sweetness</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>Defects</TableHead>
                  <TableHead className="text-right">Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.sample_name}</TableCell>
                    <TableCell>{evaluation.kilogram_name || '-'}</TableCell>
                    <TableCell>{evaluation.test_type || '-'}</TableCell>
                    <TableCell>{evaluation.process || '-'}</TableCell>
                    <TableCell>{evaluation.tds?.toFixed(2) || '-'}</TableCell>
                    <TableCell>{evaluation.roast_level || '-'}</TableCell>
                    <TableCell>{evaluation.roast_date || '-'}</TableCell>
                    <TableCell>{evaluation.green_origin || '-'}</TableCell>
                    <TableCell>{evaluation.green_variety || '-'}</TableCell>
                    <TableCell>{evaluation.fragrance_aroma?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.flavor?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.aftertaste?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.acidity?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.body?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.balance?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.uniformity?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.clean_cup?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.sweetness?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.overall?.toFixed(1) || '-'}</TableCell>
                    <TableCell>{evaluation.defects || '-'}</TableCell>
                    <TableCell className="text-right font-bold text-accent">
                      {evaluation.total_score?.toFixed(1) || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Average Scores Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Average Scores Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(avgScoresTyped).filter(([key]) => key !== 'total_score').map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{key.replace('_', ' ')}</span>
                <span className="font-medium">{(value as number).toFixed(1)}</span>
              </div>
              <Progress value={(value as number) * 10} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}