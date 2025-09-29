import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, Coffee, FileText } from 'lucide-react';
import type { Database } from "@/integrations/supabase/types";

interface CuppingEvaluationFormProps {
  sessionId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CuppingEvaluationForm({ sessionId, onSuccess, onCancel }: CuppingEvaluationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sample_name: '',
    fragrance_aroma: '',
    flavor: '',
    aftertaste: '',
    acidity: '',
    body: '',
    balance: '',
    uniformity: '',
    clean_cup: '',
    sweetness: '',
    overall: '',
    defects: '',
    notes: ''
  });

  // Calculate total score based on SCA cupping protocol
  const calculateTotalScore = () => {
    const fragrance = parseFloat(formData.fragrance_aroma) || 0;
    const flavor = parseFloat(formData.flavor) || 0;
    const aftertaste = parseFloat(formData.aftertaste) || 0;
    const acidity = parseFloat(formData.acidity) || 0;
    const body = parseFloat(formData.body) || 0;
    const balance = parseFloat(formData.balance) || 0;
    const uniformity = parseFloat(formData.uniformity) || 0;
    const cleanCup = parseFloat(formData.clean_cup) || 0;
    const sweetness = parseFloat(formData.sweetness) || 0;
    const overall = parseFloat(formData.overall) || 0;
    const defects = parseInt(formData.defects) || 0;
    
    // SCA cupping protocol scoring
    const total = fragrance + flavor + aftertaste + acidity + body + 
                 balance + uniformity + cleanCup + sweetness + overall - (defects * 2);
    
    return Math.max(0, total); // Ensure score doesn't go below 0
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const totalScore = calculateTotalScore();

    try {
      const { error } = await supabase
        .from('cupping_evaluations')
        .insert({
          cupping_session_id: sessionId,
          sample_name: formData.sample_name,
          fragrance_aroma: formData.fragrance_aroma ? parseFloat(formData.fragrance_aroma) : null,
          flavor: formData.flavor ? parseFloat(formData.flavor) : null,
          aftertaste: formData.aftertaste ? parseFloat(formData.aftertaste) : null,
          acidity: formData.acidity ? parseFloat(formData.acidity) : null,
          body: formData.body ? parseFloat(formData.body) : null,
          balance: formData.balance ? parseFloat(formData.balance) : null,
          uniformity: formData.uniformity ? parseFloat(formData.uniformity) : null,
          clean_cup: formData.clean_cup ? parseFloat(formData.clean_cup) : null,
          sweetness: formData.sweetness ? parseFloat(formData.sweetness) : null,
          overall: formData.overall ? parseFloat(formData.overall) : null,
          defects: formData.defects ? parseInt(formData.defects) : 0,
          total_score: totalScore,
          notes: formData.notes || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cupping evaluation created successfully!",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create cupping evaluation: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalScore = calculateTotalScore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Coffee className="h-5 w-5" />
          New Cupping Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sample_name">Sample Name *</Label>
            <Input
              id="sample_name"
              value={formData.sample_name}
              onChange={(e) => handleInputChange('sample_name', e.target.value)}
              required
              placeholder="e.g., Ethiopian Sidamo - Light Roast"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fragrance/Aroma */}
            <div className="space-y-2">
              <Label htmlFor="fragrance_aroma">Fragrance/Aroma (0-10)</Label>
              <Input
                id="fragrance_aroma"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.fragrance_aroma}
                onChange={(e) => handleInputChange('fragrance_aroma', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Flavor */}
            <div className="space-y-2">
              <Label htmlFor="flavor">Flavor (0-10)</Label>
              <Input
                id="flavor"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.flavor}
                onChange={(e) => handleInputChange('flavor', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Aftertaste */}
            <div className="space-y-2">
              <Label htmlFor="aftertaste">Aftertaste (0-10)</Label>
              <Input
                id="aftertaste"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.aftertaste}
                onChange={(e) => handleInputChange('aftertaste', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Acidity */}
            <div className="space-y-2">
              <Label htmlFor="acidity">Acidity (0-10)</Label>
              <Input
                id="acidity"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.acidity}
                onChange={(e) => handleInputChange('acidity', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Body (0-10)</Label>
              <Input
                id="body"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Balance */}
            <div className="space-y-2">
              <Label htmlFor="balance">Balance (0-10)</Label>
              <Input
                id="balance"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.balance}
                onChange={(e) => handleInputChange('balance', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Uniformity */}
            <div className="space-y-2">
              <Label htmlFor="uniformity">Uniformity (0-10)</Label>
              <Input
                id="uniformity"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.uniformity}
                onChange={(e) => handleInputChange('uniformity', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Clean Cup */}
            <div className="space-y-2">
              <Label htmlFor="clean_cup">Clean Cup (0-10)</Label>
              <Input
                id="clean_cup"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.clean_cup}
                onChange={(e) => handleInputChange('clean_cup', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Sweetness */}
            <div className="space-y-2">
              <Label htmlFor="sweetness">Sweetness (0-10)</Label>
              <Input
                id="sweetness"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.sweetness}
                onChange={(e) => handleInputChange('sweetness', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Overall */}
            <div className="space-y-2">
              <Label htmlFor="overall">Overall (0-10)</Label>
              <Input
                id="overall"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.overall}
                onChange={(e) => handleInputChange('overall', e.target.value)}
                placeholder="0.0 - 10.0"
              />
            </div>
            
            {/* Defects */}
            <div className="space-y-2">
              <Label htmlFor="defects">Defects (0-10)</Label>
              <Input
                id="defects"
                type="number"
                min="0"
                max="10"
                value={formData.defects}
                onChange={(e) => handleInputChange('defects', e.target.value)}
                placeholder="0 - 10"
              />
            </div>
          </div>
          
          {/* Total Score */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Total Score</Label>
              <div className="text-2xl font-bold text-accent">{totalScore.toFixed(1)}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Calculated automatically based on SCA cupping protocol
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Tasting Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              placeholder="Describe the flavor profile, aroma, acidity, body, and any unique characteristics..."
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Evaluation"}
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