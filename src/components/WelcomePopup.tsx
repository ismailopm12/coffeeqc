import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type WelcomePopupSetting = Database['public']['Tables']['welcome_popup_settings']['Row'];
type UserPopupInteraction = Database['public']['Tables']['user_popup_interactions']['Row'];

const WelcomePopup = () => {
  const { user } = useAuth();
  const [popupSetting, setPopupSetting] = useState<WelcomePopupSetting | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkPopupStatus();
    }
  }, [user]);

  const checkPopupStatus = async () => {
    try {
      // Get the active popup setting
      const { data: popupSettings, error: settingsError } = await supabase
        .from('welcome_popup_settings')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (settingsError) throw settingsError;

      if (popupSettings && popupSettings.length > 0) {
        const activePopup = popupSettings[0];
        setPopupSetting(activePopup);

        // Check if user has already seen this popup
        const { data: userInteractions, error: interactionError } = await supabase
          .from('user_popup_interactions')
          .select('*')
          .eq('user_id', user?.id)
          .eq('popup_setting_id', activePopup.id);

        if (interactionError) throw interactionError;

        // If show_once is true and user has seen it, don't show again
        if (activePopup.show_once && userInteractions && userInteractions.length > 0) {
          const interaction = userInteractions[0];
          if (interaction.dismissed) {
            setIsVisible(false);
            setIsLoading(false);
            return;
          }
        }

        // Show the popup
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking popup status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async () => {
    if (!user || !popupSetting) return;

    try {
      // Record that the user has seen/dismissed the popup
      const { error } = await supabase
        .from('user_popup_interactions')
        .upsert({
          user_id: user.id,
          popup_setting_id: popupSetting.id,
          dismissed: true,
          shown_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,popup_setting_id'
        });

      if (error) throw error;

      setIsVisible(false);
    } catch (error) {
      console.error('Error dismissing popup:', error);
    }
  };

  if (isLoading || !isVisible || !popupSetting) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle className="text-center">{popupSetting.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popupSetting.image_url && (
            <div className="flex justify-center">
              <img 
                src={popupSetting.image_url} 
                alt="Welcome" 
                className="max-h-40 rounded-lg object-contain"
              />
            </div>
          )}
          <p className="text-center text-muted-foreground">
            {popupSetting.message}
          </p>
          <div className="flex justify-center pt-2">
            <Button onClick={handleDismiss}>
              {popupSetting.button_text}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePopup;