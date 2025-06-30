import { supabase, getCurrentSupabaseUserId, apiUrl } from '../utils/supabase';
import { MoodResponseModel, MoodRequestModel } from '../models/mood_model';

export class MoodService {
    static async saveMood(moodRequestModel: MoodRequestModel): Promise<MoodResponseModel> {
        const userId = await getCurrentSupabaseUserId();
        if (!userId) {
            throw new Error('User not authenticated. Cannot save mood.');
        }
        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;
            if (!accessToken) {
                throw new Error('No active Supabase session found. Please log in.');
            }

            moodRequestModel.user_id = userId; // Ensure user_id is set

            console.log('Mood request model:', moodRequestModel);

            const response = await fetch(
                `${apiUrl}/api/v1/users/mood/${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(moodRequestModel),
                }
            );

            if (!response.ok) {
                let errorMessage = `Failed to save mood: ${response.statusText}`;
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

            console.log('Mood saved successfully:', response.body);
            return (await response.json()) as MoodResponseModel;
        } catch (error) {
            console.error('Error saving mood:', error);
            throw error;
        }
    }

    static async getMoodOfCurrentUser(): Promise<MoodResponseModel> {
        const userId = await getCurrentSupabaseUserId();
        if (!userId) {
            throw new Error('User not authenticated. Cannot fetch mood.');
        }
        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;
            if (!accessToken) {
                throw new Error('No active Supabase session found. Please log in.');
            }

            const response = await fetch(
                `${apiUrl}/api/v1/users/mood/${userId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                        'ngrok-skip-browser-warning': 'true'

                    },
                }
            );

            if (!response.ok) {
                let errorMessage = `Failed to fetch mood: ${response.statusText}`;
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

            return (await response.json()) as MoodResponseModel;
        } catch (error) {
            console.error('Error fetching mood:', error);
            throw error;
        }
    }
}



