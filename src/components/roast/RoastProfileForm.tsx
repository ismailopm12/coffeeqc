import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Flame, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoastProfileFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoastProfileForm({ onSuccess, onCancel }: RoastProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [greenAssessments, setGreenAssessments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    profile_name: '',
    green_assessment_id: '',
    batch_size: '',
    preheat_temp: '',
    charge_temp: '',
    first_crack_time: '',
    first_crack_temp: '',
    development_time: '',
    drop_temp: '',
    total_roast_time: '',
    roast_level: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadGreenAssessments();
    }
  }, [user]);

  const loadGreenAssessments = async () => {
    const { data, error } = await supabase
      .from('green_assessments')
      .select('id, origin, lot_number')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setGreenAssessments(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from('roast_profiles')
      .insert({
        user_id: user.id,
        profile_name: formData.profile_name,
        green_assessment_id: formData.green_assessment_id || null,
        batch_size: formData.batch_size ? parseFloat(formData.batch_size) : null,
        preheat_temp: formData.preheat_temp ? parseInt(formData.preheat_temp) : null,
        charge_temp: formData.charge_temp ? parseInt(formData.charge_temp) : null,
        first_crack_time: formData.first_crack_time ? parseInt(formData.first_crack_time) : null,
        first_crack_temp: formData.first_crack_temp ? parseInt(formData.first_crack_temp) : null,
        development_time: formData.development_time ? parseInt(formData.development_time) : null,
        drop_temp: formData.drop_temp ? parseInt(formData.drop_temp) : null,
        total_roast_time: formData.total_roast_time ? parseInt(formData.total_roast_time) : null,
        roast_level: formData.roast_level || null,
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
        description: "Roast profile created successfully!",
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
        <CardTitle className="flex items-center gap-2 text-coffee-roast">
          <Flame className="h-5 w-5" />
          Create Roast Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="profile_name">Profile Name *</Label>
              <Input
                id="profile_name"
                value={formData.profile_name}
                onChange={(e) => handleInputChange('profile_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="green_assessment_id">Green Bean Source</Label>
              <Select value={formData.green_assessment_id} onValueChange={(value) => handleInputChange('green_assessment_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select green bean assessment" />
                </SelectTrigger>
                <SelectContent>
                  {greenAssessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      {assessment.origin} - {assessment.lot_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch_size">Batch Size (kg)</Label>
              <Input
                id="batch_size"
                type="number"
                step="0.1"
                value={formData.batch_size}
                onChange={(e) => handleInputChange('batch_size', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roast_level">Roast Level</Label>
              <Select value={formData.roast_level} onValueChange={(value) => handleInputChange('roast_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select roast level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="light-medium">Light-Medium</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="medium-dark">Medium-Dark</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preheat_temp">Preheat Temperature (°C)</Label>
              <Input
                id="preheat_temp"
                type="number"
                value={formData.preheat_temp}
                onChange={(e) => handleInputChange('preheat_temp', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="charge_temp">Charge Temperature (°C)</Label>
              <Input
                id="charge_temp"
                type="number"
                value={formData.charge_temp}
                onChange={(e) => handleInputChange('charge_temp', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_crack_time">First Crack Time (seconds)</Label>
              <Input
                id="first_crack_time"
                type="number"
                value={formData.first_crack_time}
                onChange={(e) => handleInputChange('first_crack_time', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="first_crack_temp">First Crack Temperature (°C)</Label>
              <Input
                id="first_crack_temp"
                type="number"
                value={formData.first_crack_temp}
                onChange={(e) => handleInputChange('first_crack_temp', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="development_time">Development Time (seconds)</Label>
              <Input
                id="development_time"
                type="number"
                value={formData.development_time}
                onChange={(e) => handleInputChange('development_time', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="drop_temp">Drop Temperature (°C)</Label>
              <Input
                id="drop_temp"
                type="number"
                value={formData.drop_temp}
                onChange={(e) => handleInputChange('drop_temp', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total_roast_time">Total Roast Time (seconds)</Label>
              <Input
                id="total_roast_time"
                type="number"
                value={formData.total_roast_time}
                onChange={(e) => handleInputChange('total_roast_time', e.target.value)}
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
            <Button type="submit" disabled={loading} className="bg-coffee-roast hover:bg-coffee-roast/90">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Create Profile"}
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