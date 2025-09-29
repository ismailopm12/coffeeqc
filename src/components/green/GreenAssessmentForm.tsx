import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Coffee, Save, Edit3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type GreenAssessment = Database['public']['Tables']['green_assessments']['Row'];

interface GreenAssessmentFormProps {
  assessment?: GreenAssessment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function GreenAssessmentForm({ assessment, onSuccess, onCancel }: GreenAssessmentFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lot_number: assessment?.lot_number || '',
    origin: assessment?.origin || '',
    variety: assessment?.variety || '',
    process: assessment?.process || '',
    moisture_content: assessment?.moisture_content?.toString() || '',
    density: assessment?.density?.toString() || '',
    screen_size: assessment?.screen_size || '',
    defects_primary: assessment?.defects_primary?.toString() || '',
    defects_secondary: assessment?.defects_secondary?.toString() || '',
    grade: assessment?.grade || '',
    notes: assessment?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      if (assessment) {
        // Update existing assessment
        const { error } = await supabase
          .from('green_assessments')
          .update({
            lot_number: formData.lot_number,
            origin: formData.origin,
            variety: formData.variety || null,
            process: formData.process || null,
            moisture_content: formData.moisture_content ? parseFloat(formData.moisture_content) : null,
            density: formData.density ? parseFloat(formData.density) : null,
            screen_size: formData.screen_size || null,
            defects_primary: formData.defects_primary ? parseInt(formData.defects_primary) : 0,
            defects_secondary: formData.defects_secondary ? parseInt(formData.defects_secondary) : 0,
            grade: formData.grade || null,
            notes: formData.notes || null
          })
          .eq('id', assessment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Green coffee assessment updated successfully!",
        });
      } else {
        // Create new assessment
        const { error } = await supabase
          .from('green_assessments')
          .insert({
            user_id: user.id,
            lot_number: formData.lot_number,
            origin: formData.origin,
            variety: formData.variety || null,
            process: formData.process || null,
            moisture_content: formData.moisture_content ? parseFloat(formData.moisture_content) : null,
            density: formData.density ? parseFloat(formData.density) : null,
            screen_size: formData.screen_size || null,
            defects_primary: formData.defects_primary ? parseInt(formData.defects_primary) : 0,
            defects_secondary: formData.defects_secondary ? parseInt(formData.defects_secondary) : 0,
            grade: formData.grade || null,
            notes: formData.notes || null
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Green coffee assessment saved successfully!",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-coffee-green">
          <Coffee className="h-5 w-5" />
          {assessment ? 'Edit Green Coffee Assessment' : 'New Green Coffee Assessment'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_number">Lot Number *</Label>
              <Input
                id="lot_number"
                value={formData.lot_number}
                onChange={(e) => handleInputChange('lot_number', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">Variety</Label>
              <Input
                id="variety"
                value={formData.variety}
                onChange={(e) => handleInputChange('variety', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="process">Process</Label>
              <Select value={formData.process} onValueChange={(value) => handleInputChange('process', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="washed">Washed</SelectItem>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="honey">Honey</SelectItem>
                  <SelectItem value="pulped-natural">Pulped Natural</SelectItem>
                  <SelectItem value="semi-washed">Semi-Washed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="moisture_content">Moisture Content (%)</Label>
              <Input
                id="moisture_content"
                type="number"
                step="0.1"
                value={formData.moisture_content}
                onChange={(e) => handleInputChange('moisture_content', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="density">Density (g/ml)</Label>
              <Input
                id="density"
                type="number"
                step="0.01"
                value={formData.density}
                onChange={(e) => handleInputChange('density', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screen_size">Screen Size</Label>
              <Input
                id="screen_size"
                value={formData.screen_size}
                onChange={(e) => handleInputChange('screen_size', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defects_primary">Primary Defects</Label>
              <Input
                id="defects_primary"
                type="number"
                min="0"
                value={formData.defects_primary}
                onChange={(e) => handleInputChange('defects_primary', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defects_secondary">Secondary Defects</Label>
              <Input
                id="defects_secondary"
                type="number"
                min="0"
                value={formData.defects_secondary}
                onChange={(e) => handleInputChange('defects_secondary', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="bg-coffee-green hover:bg-coffee-green/90">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : (assessment ? "Update Assessment" : "Save Assessment")}
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