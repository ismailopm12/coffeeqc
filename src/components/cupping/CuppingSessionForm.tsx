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
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from('cupping_sessions')
      .insert({
        user_id: user.id,
        session_name: formData.session_name,
        cupper_name: formData.cupper_name || null,
        cupping_date: formData.cupping_date,
        notes: formData.notes || null
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Cupping session created successfully!",
      });
      onSuccess();
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <FileText className="h-5 w-5" />
          New Cupping Session
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Session Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Session objectives, environmental conditions, etc..."
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Creating..." : "Create Session"}
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