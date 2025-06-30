import { supabase, getCurrentSupabaseUserId, apiUrl } from '../utils/supabase';
import { ResponseModel } from '../models/response_model';

export class DeleteService {
    static async deleteGoal(goalId: string): Promise<ResponseModel> {
        const userId = await getCurrentSupabaseUserId();

        if (!userId) {
            throw new Error('User not authenticated. Cannot delete account.');
        }

        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;

            if (!accessToken) {
                throw new Error('No active Supabase session found. Please log in.');
            }

            const response = await fetch(
                `${apiUrl}/api/v1/ai_gen/goal/${goalId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            return {
                message: 'Account deleted successfully',
                data: '',
                status: 200,
            };
        } catch (error) {
            console.error('Error deleting account:', error);
            return {
                message: 'Failed to delete account',
                data: '',
                status: 500,
            };
        }
    }

    static async deleteChat(): Promise<{message: string}> {
        const userId = await getCurrentSupabaseUserId();

        if (!userId) {
            throw new Error('User not authenticated. Cannot delete chat.');
        }

        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;

            if (!accessToken) {
                throw new Error('No active Supabase session found. Please log in.');
            }

            const response = await fetch(`${apiUrl}/api/v1/ai_gen/chat/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete chat');
            }

            return {
                message: 'success',
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            return {
                message: 'failed',
            }
        }
    }

    static async deleteUserData(): Promise<{message: string}> {
        const userId = await getCurrentSupabaseUserId();

        if (!userId) {
            throw new Error('User not authenticated. Cannot delete user data.');
        }

        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;

            if (!accessToken) {
                throw new Error('No active Supabase session found. Please log in.');
            }

            const response = await fetch(`${apiUrl}/api/v1/users/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user data');
            }

            return {
                message: 'success',
            }
        } catch (error) {
            console.error('Error deleting user data:', error);
            return {
                message: 'failed',
            }
        }        
    }
}
