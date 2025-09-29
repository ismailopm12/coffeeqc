import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, X } from 'lucide-react';
import type { Database } from "@/integrations/supabase/types";

type RoastProfile = Database['public']['Tables']['roast_profiles']['Row'];

interface EditRoastProfileFormProps {
  profile: RoastProfile;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditRoastProfileForm({ profile, onSuccess, onCancel }: EditRoastProfileFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profile_name: profile.profile_name || '',
    batch_size: profile.batch_size?.toString() || '',
    preheat_temp: profile.preheat_temp?.toString() || '',
    charge_temp: profile.charge_temp?.toString() || '',
    first_crack_time: profile.first_crack_time?.toString() || '',
    first_crack_temp: profile.first_crack_temp?.toString() || '',
    development_time: profile.development_time?.toString() || '',
    drop_temp: profile.drop_temp?.toString() || '',
    total_roast_time: profile.total_roast_time?.toString() || '',
    roast_level: profile.roast_level || '',
    notes: profile.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Admins can update any roast profile
      const { error } = await supabase
        .from('roast_profiles')
        .update({
          profile_name: formData.profile_name,
          batch_size: formData.batch_size ? parseFloat(formData.batch_size) : null,
          preheat_temp: formData.preheat_temp ? parseInt(formData.preheat_temp) : null,
          charge_temp: formData.charge_temp ? parseInt(formData.charge_temp) : null,
          first_crack_time: formData.first_crack_time ? parseInt(formData.first_crack_time) : null,
          first_crack_temp: formData.first_crack_temp ? parseInt(formData.first_crack_temp) : null,
          development_time: formData.development_time ? parseInt(formData.development_time) : null,
          drop_temp: formData.drop_temp ? parseInt(formData.drop_temp) : null,
          total_roast_time: formData.total_roast_time ? parseInt(formData.total_roast_time) : null,
          roast_level: formData.roast_level || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Roast profile updated successfully!",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update roast profile: " + (error as Error).message,
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Edit Roast Profile</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile_name">Profile Name *</Label>
              <Input
                id="profile_name"
                value={formData.profile_name}
                onChange={(e) => handleInputChange('profile_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roast_level">Roast Level</Label>
              <Input
                id="roast_level"
                value={formData.roast_level}
                onChange={(e) => handleInputChange('roast_level', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="batch_size">Batch Size (kg)</Label>
              <Input
                id="batch_size"
                type="number"
                step="0.01"
                value={formData.batch_size}
                onChange={(e) => handleInputChange('batch_size', e.target.value)}
              />
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
              <Label htmlFor="first_crack_time">First Crack Time (sec)</Label>
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
              <Label htmlFor="development_time">Development Time (sec)</Label>
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
              <Label htmlFor="total_roast_time">Total Roast Time (sec)</Label>
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
              {loading ? "Saving..." : "Save Changes"}
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