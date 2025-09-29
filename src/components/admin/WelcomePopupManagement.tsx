import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Upload } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type WelcomePopupSetting = Database['public']['Tables']['welcome_popup_settings']['Row'];

const WelcomePopupManagement = () => {
  const { toast } = useToast();
  const [popupSetting, setPopupSetting] = useState<WelcomePopupSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image_url: '',
    button_text: '',
    is_active: true,
    show_once: true
  });

  useEffect(() => {
    fetchPopupSetting();
  }, []);

  const fetchPopupSetting = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('welcome_popup_settings')
        .select('*')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const setting = data[0];
        setPopupSetting(setting);
        setFormData({
          title: setting.title,
          message: setting.message,
          image_url: setting.image_url || '',
          button_text: setting.button_text,
          is_active: setting.is_active,
          show_once: setting.show_once
        });
      } else {
        // Create default popup setting if none exists
        createDefaultPopupSetting();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch popup settings: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPopupSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('welcome_popup_settings')
        .insert({
          title: 'Welcome to Our Coffee Quality System',
          message: 'Thank you for visiting our professional coffee quality control platform.',
          button_text: 'Continue',
          is_active: true,
          show_once: true
        })
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const setting = data[0];
        setPopupSetting(setting);
        setFormData({
          title: setting.title,
          message: setting.message,
          image_url: setting.image_url || '',
          button_text: setting.button_text,
          is_active: setting.is_active,
          show_once: setting.show_once
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create default popup setting: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      
      // Check if storage bucket exists
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketError) throw bucketError;
      
      const imagesBucket = buckets?.find(bucket => bucket.id === 'images');
      if (!imagesBucket) {
        toast({
          title: "Storage Bucket Not Found",
          description: "The images storage bucket doesn't exist yet. Please run the database migrations to create it.",
          variant: "destructive"
        });
        setImageUploading(false);
        return;
      }

      // Upload image to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `welcome-popup/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!popupSetting) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('welcome_popup_settings')
        .update({
          title: formData.title,
          message: formData.message,
          image_url: formData.image_url,
          button_text: formData.button_text,
          is_active: formData.is_active,
          show_once: formData.show_once,
          updated_at: new Date().toISOString()
        })
        .eq('id', popupSetting.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Popup settings updated successfully!"
      });

      // Refresh the data
      fetchPopupSetting();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update popup settings: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Popup Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Popup Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter popup title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                  placeholder="Enter button text"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message">Popup Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter popup message"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Popup Image</Label>
                <div className="flex items-center gap-4">
                  {formData.image_url && (
                    <div className="flex-shrink-0">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        disabled={imageUploading}
                      >
                        {imageUploading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload an image to display in the popup (optional)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Toggle to enable or disable the popup
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Show Once Per User</Label>
                  <Switch
                    checked={formData.show_once}
                    onCheckedChange={(checked) => handleInputChange('show_once', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  If enabled, each user will only see the popup once
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {popupSetting && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-center mb-2">{formData.title}</h3>
              {formData.image_url && (
                <div className="flex justify-center my-4">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="max-h-32 rounded-md"
                  />
                </div>
              )}
              <p className="text-muted-foreground text-center mb-4">{formData.message}</p>
              <div className="flex justify-center">
                <Button>{formData.button_text}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WelcomePopupManagement;