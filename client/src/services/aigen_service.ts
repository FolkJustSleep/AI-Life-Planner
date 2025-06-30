// src/services/aigen_service.ts

import { supabase, getCurrentSupabaseUserId, apiUrl } from '../utils/supabase';
import { ClientProfileData } from '../models/user_model';
import { ResponseModel } from '../models/response_model';

export const generateAIPlan = async (clientProfileData: ClientProfileData): Promise<ResponseModel> => {
  const userId = await getCurrentSupabaseUserId();

  if (!userId) {
    throw new Error('User not authenticated. Cannot generate plan.');
  }

  const aiPromptPayload = clientProfileData;

  try {
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;

    if (!accessToken) {
      throw new Error('No active Supabase session found. Please log in.');
    }

    const response = await fetch(`${apiUrl}/api/v1/ai_gen/create_ai_gen/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(aiPromptPayload),
    });

    if (!response.ok) {
      let errorMessage = `Failed to generate AI plan: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    return await response.json() as ResponseModel;
  } catch (error) {
    console.error('Error generating AI plan:', error);
    throw error;
  }
};