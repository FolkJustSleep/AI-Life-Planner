import { apiUrl, getCurrentSupabaseUserId} from "../utils/supabase";
import { LifeGoalsData, ApiResponse } from "../models/lifegoal_model";

// Service layer for Life Goals
export class LifeGoalService {

  static async getLifeGoalsByUserId(): Promise<LifeGoalsData> {
    try {
      const userId = await getCurrentSupabaseUserId();
      const response = await fetch(`${apiUrl}/api/v1/lifegoals/users/${userId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        // If 403 and message is "cannot get life goal data", treat as empty
        try {
          const errorJson = JSON.parse(errorText);
          if (
            response.status === 403 &&
            errorJson.message &&
            errorJson.message.toLowerCase().includes('cannot get life goal data')
          ) {
            // Return an empty LifeGoalsData object
            return {
              id: '',
              user_id: userId? userId : '',
              short_term: [],
              long_term: [],
              priorities: [],
              timeframe: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          }
        } catch (e) {
          // Not JSON, fall through to error
        }
        throw new Error(`API Error ${response.status}: ${response.statusText}\nResponse: ${errorText.substring(0, 200)}...`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response starts with: ${responseText.substring(0, 100)}...`);
      }

      const result: ApiResponse = await response.json();
      if (!result.data) {
        // Treat as empty
        return {
          id: '',
          user_id: userId  ? userId : '',
          short_term: [],
          long_term: [],
          priorities: [],
          timeframe: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      console.log('Life Goals API Response:', result);
      return result.data;
    } catch (error) {
      console.error('Error fetching life goals:', error);
      throw error;
    }
  }

  static async getAiPlan(): Promise<{ generated_plan: string | null; id: string | null }> {
    try {
      const userId = await getCurrentSupabaseUserId();
      const url = `${apiUrl}/api/v1/ai_gen/ai_gen/${userId}`;
      console.log('Fetching AI plan for user:', userId, 'URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if(response.status === 403) {
        // If 403, return empty AI plan
        console.warn('403 Forbidden: Returning empty AI plan');
        return {
          generated_plan: null,
          id: null,
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`API Error ${response.status}: ${response.statusText}\nResponse: ${errorText.substring(0, 200)}...`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response starts with: ${responseText.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('AI Plan API Response:', result);

      // Fix: Expect data to be an array and extract generated_plan
      if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
        throw new Error('No AI plan array received from API');
      }

      const body = {
        generated_plan:String(result.data[0]?.generated_plan), // Access result.data[0]?.generated_plan,
        id:String(result.data[0]?.id), // Access result.data[0]?.id, or use result.data[0]?.id.toString() result.data[0]?.id
      }
      if (!body.generated_plan || typeof body.id !== 'string' ) {
        throw new Error('No generated_plan string found in API response');
      }
      return body
    } catch (error) {
      console.error('Error fetching ai plan:', error);
      throw error;
    }
  }

  static async deleteGoal(goalId: string, type: 'short_term' | 'long_term'): Promise<void> {
    const userId = await getCurrentSupabaseUserId();
    if (!userId) throw new Error('User not authenticated.');
    const response = await fetch(`${apiUrl}/api/v1/lifegoals/users/${userId}/goal`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goalId, type }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete goal');
    }
  }
}

export default LifeGoalService;