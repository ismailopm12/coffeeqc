import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Save, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CuppingSessionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CuppingSessionForm({ onSuccess, onCancel }: CuppingSessionFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    session_name: '',
    cupper_name: '',
    cupping_date: new Date().toISOString().split('T')[0],
    notes: '',
    // Additional session-level profile options
    session_type: '',
    location: '',
    environmental_conditions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a cupping session",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('cupping_sessions')
        .insert({
          user_id: user.id,
          session_name: formData.session_name,
          cupper_name: formData.cupper_name || null,
          cupping_date: formData.cupping_date,
          notes: formData.notes || null,
          // Additional session-level profile options
          session_type: formData.session_type || null,
          location: formData.location || null,
          environmental_conditions: formData.environmental_conditions || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cupping session created successfully!",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create cupping session: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-lg border border-accent/20">
      <CardHeader className="bg-accent/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-accent">
          <FileText className="h-5 w-5" />
          New Cupping Session
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="session_name" className="font-medium">Session Name *</Label>
              <Input
                id="session_name"
                value={formData.session_name}
                onChange={(e) => handleInputChange('session_name', e.target.value)}
                required
                className="border-accent/30 focus:border-accent focus:ring-accent"
                placeholder="e.g., Morning Cupping - Ethiopian Lots"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cupper_name" className="font-medium">Cupper Name</Label>
              <Input
                id="cupper_name"
                value={formData.cupper_name}
                onChange={(e) => handleInputChange('cupper_name', e.target.value)}
                className="border-accent/30 focus:border-accent focus:ring-accent"
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session_type" className="font-medium">Session Type</Label>
              <Select value={formData.session_type} onValueChange={(value) => handleInputChange('session_type', value)}>
                <SelectTrigger className="border-accent/30 focus:border-accent focus:ring-accent">
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
              <Label htmlFor="cupping_date" className="font-medium">Cupping Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cupping_date"
                  type="date"
                  value={formData.cupping_date}
                  onChange={(e) => handleInputChange('cupping_date', e.target.value)}
                  className="pl-10 border-accent/30 focus:border-accent focus:ring-accent"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location" className="font-medium">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="border-accent/30 focus:border-accent focus:ring-accent"
                placeholder="e.g., Cupping Lab A, Roastery"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="environmental_conditions" className="font-medium">Environmental Conditions</Label>
            <Textarea
              id="environmental_conditions"
              value={formData.environmental_conditions}
              onChange={(e) => handleInputChange('environmental_conditions', e.target.value)}
              rows={3}
              className="border-accent/30 focus:border-accent focus:ring-accent"
              placeholder="Temperature, humidity, atmospheric pressure, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium">Session Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="border-accent/30 focus:border-accent focus:ring-accent"
              placeholder="Session objectives, special instructions, etc..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Creating Session..." : "Create Session"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 border-accent/30 hover:bg-accent/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}