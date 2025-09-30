import { supabase } from '@/integrations/supabase/client';

// Test the Supabase connection and schema
export const testSupabaseConnection = async () => {
  try {
    // Test connection by fetching the schema
    const { data, error } = await supabase
      .from('cupping_sessions')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }

    console.log('Supabase connection test successful');
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
};

// Test inserting a cupping session
export const testInsertCuppingSession = async (userId: string) => {
  try {
    const testData = {
      user_id: userId,
      session_name: 'Test Session',
      cupper_name: 'Test Cupper',
      cupping_date: new Date().toISOString(),
      notes: 'Test notes',
      session_type: 'quality-control',
      location: 'Test Lab',
      environmental_conditions: 'Temperature: 22°C, Humidity: 65%'
    };

    const { data, error } = await supabase
      .from('cupping_sessions')
      .insert(testData)
      .select();

    if (error) {
      console.error('Cupping session insert test failed:', error);
      return { success: false, error };
    }

    console.log('Cupping session insert test successful');
    return { success: true, data };
  } catch (error) {
    console.error('Cupping session insert test failed:', error);
    return { success: false, error };
  }
};