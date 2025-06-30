import { supabase, getCurrentSupabaseUserId, apiUrl } from '../utils/supabase';
import { HabitsModel, HabitData } from '../models/habits_model';
import { ResponseModel } from '../models/response_model';

export class HabitService {
  static async saveHabits(habit: HabitsModel): Promise<ResponseModel> {
    const userId = await getCurrentSupabaseUserId();

    if (!userId) {
      throw new Error('User not authenticated. Cannot save habits.');
    }
    const habitsPayload = {
      userid: userId,
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      category: habit.category,
      target_count: habit.target_count,
      current_streak: habit.current_streak,
      completed_dates: habit.completed_dates,
    };

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error('No active Supabase session found. Please log in.');
      }

      console.log('Saving habits for user:', userId, 'Payload:', habitsPayload);
      console.log('target count type:', typeof(habitsPayload.target_count));
      
      const response = await fetch(
        `${apiUrl}/api/v1/users/habit/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(habitsPayload),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to save profile: ${response.statusText}`;
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

      return (await response.json()) as ResponseModel;
    } catch (error) {
      console.error('Error saving user habits:', error);
      throw error;
    }
  }

  static async getHabits(): Promise<HabitData[]> {
    const userId = await getCurrentSupabaseUserId();
    if (!userId) {
      throw new Error('User not authenticated. Cannot fetch habits.');
    }

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (!accessToken) {
        throw new Error('No active Supabase session found. Please log in.');
      }
      const response = await fetch(`${apiUrl}/api/v1/users/habit/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Raw response:', text);
        let errorMessage = `Failed to fetch habits: ${response.statusText}`;
        try {
          const errorData = JSON.parse(text);
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Habits API Response:', result);
      return result.data as HabitData[];
    } catch (error) {
      console.error('Error fetching user habits:', error);
      throw error;
    }
  }
}

export default HabitService;